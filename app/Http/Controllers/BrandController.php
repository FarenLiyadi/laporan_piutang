<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\Sales;
use App\Models\UserActivity;
use Carbon\Carbon;
use Exception;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Ramsey\Uuid\Uuid;

class BrandController extends Controller
{
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Brand/Index',[
            
        ]);
    }

    public function listBrand(Request $request)
    {
     
        $length     = $request->input('length', 10);
        $page       = $request->input('page', 1);
        $namaPaket   = $request->input('namaPaket');
        

        $validator = Validator::make($request->all(), [
            'length'    => 'required|integer|min:1|max:100',
            'page'      => 'required|integer|min:1',
            'namaPaket'  => 'nullable|string',
         
        ]);

        Try {
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
            

            $offset     = $length * ($page - 1);
            $itemInfo   = Brand::query()->where('deleted_at',null);

            if ($namaPaket) {
                $itemInfo->where(function ($query) use ($namaPaket) {
                    $query->where('brand_name', 'LIKE', "%$namaPaket%");
                });
            }
            

            $response = [
                "total" => $itemInfo->count(),
                "item"  => $itemInfo->orderByDesc('created_at')->skip($offset)->take($length)->get(),
                
            ];
            $this->dataMsg  = $response;
            $this->code     = 0;
            
        } catch (Exception $e) {
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
   


        
    }

   
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $brand_name = $request->input('brand_name');
        // Log::info('Brand Name: ' . $brand_name);
     
        $page       = $request->input('page', 1);
        $length     = $request->input('length', 10);

        $validator = Validator::make($request->all(), [
            'brand_name'      => 'required|string',
            'page'=>'nullable',
            'length'=>'nullable',
            
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
           



            Brand::create([
               
                "brand_name"      => $brand_name,
             
       
                
            ]);
             // User Activity
             UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => Auth::user()->username,
                "description"   => "Create New Brand ".$brand_name,
                "activity_type" => (int) 1,
                "created_by"    => Auth::user()->username,
            ]);

        
            $offset     = $length * ($page - 1);
            $itemInfo   = Brand::where('deleted_at',null);

            $response = [
                "total" => $itemInfo->count(),
                "item"  => $itemInfo->orderByDesc('created_at')->skip($offset)->take($length)->get(),
                "flash" => "Data brand berhasil ditambahkan!",
                
            ];

            $this->code = 0;
            $this->message = "";
            $this->dataMsg = $response;
        }
        catch(Exception $e){
            $this->message = $e->getMessage();
        }
        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function update(Request $request)
    {
        $client_id = $request->input('client_id');
        $brand_name = $request->input('brand_name');
       
        $page       = $request->input('page', 1);
        $length     = $request->input('length', 10);

        $validator = Validator::make($request->all(), [
            'client_id'      => 'required',
            'brand_name'      => 'required|string',
            
            'page'=>'nullable',
            'length'=>'nullable',
            
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            $itemInfo = Brand::where('id',$client_id)->first();
            if (!$itemInfo){
                $this->code = 104;
                throw new Exception($this->getErrorMessage($this->code));
            }
          
            $updateData = [
                "brand_name"      => $brand_name,
              
            ];
            $oldData =  $itemInfo->toArray();
            $itemInfo->update($updateData);
            $itemInfo->save();
             // User Activity
             UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => Auth::user()->username,
                "description"   => "Edit brand ".$brand_name,
                "activity_type" => (int) 2,
                "old_data"      => $oldData ?? '',
                "created_by"    => Auth::user()->username,
            ]);

        
            $offset     = $length * ($page - 1);
            $itemInfo2   = Brand::where('deleted_at',null);

            $response = [
                "total" => $itemInfo2->count(),
                "item"  => $itemInfo2->orderByDesc('created_at')->skip($offset)->take($length)->get(),
                "flash" => "Data Brand berhasil diEdit!",
                
            ];

            $this->code = 0;
            $this->message = "";
            $this->dataMsg = $response;
        }
        catch(Exception $e){
            $this->message = $e->getMessage();
        }
        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    /**
     * Display the specified resource.
     */

    

    /**
     * Remove the specified resource from storage.
     */
   public function destroy(Request $request)
{
    $validator = Validator::make($request->all(), [
        'id' => 'required|exists:brands,id',
        'page' => 'nullable|integer|min:1',
        'length' => 'nullable|integer|min:1',
    ]);

    try {
        if ($validator->fails()) {
            $this->code = 1;
            throw new Exception($validator->errors()->first());
        }

        $id = $request->input('id');
        $page = $request->input('page', 1);
        $length = $request->input('length', 10);

        $brand = Brand::find($id);

        if (!$brand) {
            $this->code = 104;
            throw new Exception("Brand tidak ditemukan.");
        }

        $brand_name = $brand->brand_name;
  // CEK apakah brand dipakai oleh produk manapun
        $usedByProducts = Product::where('brand_id', $brand->id)->exists();

        if ($usedByProducts) {
            $this->code = 1;
            throw new Exception("Merk '$brand_name' tidak dapat dihapus karena digunakan oleh produk.");
        }
        // SOFT DELETE YANG BENAR
        $brand->delete();

        // Log activity
        UserActivity::create([
            "id"            => Uuid::uuid1(),
            "username"      => Auth::user()->username,
            "description"   => "Hapus brand " . $brand_name,
            "activity_type" => (int) 3,
            "created_by"    => Auth::user()->username,
        ]);

        $itemLoad = Brand::paginate($length);

        $response = [
            "total" => $itemLoad->total(),
            "item"  => $itemLoad->items(),
            "flash" => "Data brand $brand_name berhasil dihapus!",
        ];

        $this->code = 0;
        $this->message = "";
        $this->dataMsg = $response;
    }
    catch (Exception $e) {
        $this->message = $e->getMessage();
    }

    return $this->createResponse($this->dataMsg, $this->code, $this->message);
}
public function createInline(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|min:2|max:80',
    ]);

    try {
        if ($validator->fails()) {
            $this->code = 1;
            throw new Exception($validator->errors()->first());
        }

        $name = trim($request->input('name'));
        $name = preg_replace('/\s+/', ' ', $name);

        // Anti duplikat (case-insensitive)
        $existing = Brand::whereNull('deleted_at')
            ->whereRaw('LOWER(brand_name) = ?', [mb_strtolower($name)])
            ->first();

        if ($existing) {
            $this->code = 0;
            $this->message = "Brand sudah ada, dipilih otomatis.";
            $this->dataMsg = [
                'value' => $existing->id,
                'label' => $existing->brand_name,
            ];
            return $this->createResponse($this->dataMsg, $this->code, $this->message);
        }

        $brand = Brand::create([
            "brand_name" => $name,
        ]);

        // User Activity
        UserActivity::create([
            "id"            => Uuid::uuid1(),
            "username"      => Auth::user()->username,
            "description"   => "Create New Brand " . $name,
            "activity_type" => (int) 1,
            "created_by"    => Auth::user()->username,
        ]);

        $this->code = 0;
        $this->message = "Brand berhasil ditambahkan.";
        $this->dataMsg = [
            'value' => $brand->id,
            'label' => $brand->brand_name,
        ];
    } catch (Exception $e) {
        $this->code = 1;
        $this->message = $e->getMessage();
        $this->dataMsg = null;
    }

    return $this->createResponse($this->dataMsg, $this->code, $this->message);
}


}
