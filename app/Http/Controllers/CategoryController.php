<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\Sales;
use App\Models\Unit;
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

class CategoryController extends Controller
{
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Category/Index',[
            
        ]);
    }

    public function listcategory(Request $request)
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
            $itemInfo   = Category::query();

            if ($namaPaket) {
                $itemInfo->where(function ($query) use ($namaPaket) {
                    $query->where('category_name', 'LIKE', "%$namaPaket%");
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

        $category_name = $request->input('category_name');
        // Log::info('Brand Name: ' . $category_name);
     
        $page       = $request->input('page', 1);
        $length     = $request->input('length', 10);

        $validator = Validator::make($request->all(), [
            'category_name'      => 'required|string',
            'page'=>'nullable',
            'length'=>'nullable',
            
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
           



            Category::create([
               
                "category_name"      => $category_name,
             
       
                
            ]);
             // User Activity
             UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => Auth::user()->username,
                "description"   => "Create New Unit ".$category_name,
                "activity_type" => (int) 1,
                "created_by"    => Auth::user()->username,
            ]);

        
            $offset     = $length * ($page - 1);
            $itemInfo   = Category::query();

            $response = [
                "total" => $itemInfo->count(),
                "item"  => $itemInfo->orderByDesc('created_at')->skip($offset)->take($length)->get(),
                "flash" => "Data category berhasil ditambahkan!",
                
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
        $category_name = $request->input('category_name');
       
        $page       = $request->input('page', 1);
        $length     = $request->input('length', 10);

        $validator = Validator::make($request->all(), [
            'client_id'      => 'required',
            'category_name'      => 'required|string',
            
            'page'=>'nullable',
            'length'=>'nullable',
            
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            $itemInfo = Category::where('id',$client_id)->first();
            if (!$itemInfo){
                $this->code = 104;
                throw new Exception($this->getErrorMessage($this->code));
            }
          
            $updateData = [
                "category_name"      => $category_name,
              
            ];
            $oldData =  $itemInfo->toArray();
            $itemInfo->update($updateData);
            $itemInfo->save();
             // User Activity
             UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => Auth::user()->username,
                "description"   => "Edit brand ".$category_name,
                "activity_type" => (int) 2,
                "old_data"      => $oldData ?? '',
                "created_by"    => Auth::user()->username,
            ]);

        
            $offset     = $length * ($page - 1);
            $itemInfo2   = Category::query();

            $response = [
                "total" => $itemInfo2->count(),
                "item"  => $itemInfo2->orderByDesc('created_at')->skip($offset)->take($length)->get(),
                "flash" => "Data category berhasil diEdit!",
                
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
        'id'     => 'required|exists:units,id',
        'page'   => 'nullable|integer|min:1',
        'length' => 'nullable|integer|min:1',
    ]);

    try {
        if ($validator->fails()) {
            $this->code = 1;
            throw new Exception($validator->errors()->first());
        }

        $id     = $request->input('id');
        $page   = $request->input('page', 1);
        $length = $request->input('length', 10);

        $unit = Category::find($id);

        if (!$unit) {
            $this->code = 104;
            throw new Exception("Unit tidak ditemukan.");
        }

        $category_name = $unit->category_name;

        // CEK apakah unit dipakai oleh produk manapun
        $usedByProducts = Product::where('unit_id', $unit->id)->exists();

        if ($usedByProducts) {
            $this->code = 1;
            throw new Exception("category '$category_name' tidak dapat dihapus karena digunakan oleh produk.");
        }

        // DELETE PERMANEN (karena units tidak pakai soft delete)
        $unit->delete();

        UserActivity::create([
            "id"            => Uuid::uuid1(),
            "username"      => Auth::user()->username,
            "description"   => "Hapus unit " . $category_name,
            "activity_type" => 3,
            "created_by"    => Auth::user()->username,
        ]);

        $itemLoad = Category::paginate($length);

        $response = [
            "total" => $itemLoad->total(),
            "item"  => $itemLoad->items(),
            "flash" => "category $category_name berhasil dihapus.",
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




}
