<?php

namespace App\Http\Controllers;


use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\Sales;
use App\Models\Subcategory;
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

class SubcategoryController extends Controller
{
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $category = Category::
            where('deleted_at', null)
            ->get()
            ->map(function ($cust) {
                return [
                    'value' => $cust->id,
                    'label' => $cust->category_name,
                ];
            });
        return Inertia::render('Subcategory/Index',[
            'categoryList'=>$category,
        ]);
    }

    public function listsubcategory(Request $request)
{
    $validator = Validator::make($request->all(), [
        'length'      => 'required|integer|min:1|max:100',
        'page'        => 'required|integer|min:1',
        'namaPaket'      => 'nullable|string',
        'category_id' => 'nullable|integer|exists:categories,id',
    ]);

    try {
        if ($validator->fails()) {
            $this->code = 1;
            throw new Exception($validator->errors()->first());
        }

        $length      = $request->input('length', 10);
        $search      = $request->input('namaPaket');
        $category_id = $request->input('category_id');

        $query = Subcategory::with('category');

        // FILTER by category
        if ($category_id) {
            $query->where('category_id', $category_id);
        }

        // FILTER by search
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('subcategory_name', 'LIKE', "%$search%")
                  ->orWhereHas('category', function ($qr) use ($search) {
                      $qr->where('category_name', 'LIKE', "%$search%");
                  });
            });
        }

        // PAGINATION
        $data = $query->orderBy('created_at', 'desc')->paginate($length);

        $response = [
            "total" => $data->total(),
            "item"  => $data->items(),
        ];

        $this->dataMsg = $response;
        $this->code = 0;

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
    $validator = Validator::make($request->all(), [
        'category_id' => 'required|string|max:255',
        'subcategory_name' => 'required|string|max:255|unique:categories,category_name',
        'page'          => 'nullable|integer|min:1',
        'length'        => 'nullable|integer|min:1',
    ]);

    try {
        if ($validator->fails()) {
            $this->code = 1;
            throw new Exception($validator->errors()->first());
        }

        $subcategory = Subcategory::create([
            "category_id" => $request->category_id,
            "subcategory_name" => $request->subcategory_name,
        ]);

        UserActivity::create([
            "id"            => Uuid::uuid1(),
            "username"      => Auth::user()->username,
            "description"   => "Create New subCategory " . $subcategory->subcategory_name,
            "activity_type" => 1,
            "created_by"    => Auth::user()->username,
        ]);

        $length = $request->length ?? 10;

        $data = subcategory::with('category')->orderByDesc('created_at')->paginate($length);

        $response = [
            "total" => $data->total(),
            "item"  => $data->items(),
            "flash" => "Data category berhasil ditambahkan!",
        ];

        $this->code = 0;
        $this->dataMsg = $response;

    } catch(Exception $e) {
        $this->message = $e->getMessage();
    }

    return $this->createResponse($this->dataMsg, $this->code, $this->message);
}


   public function update(Request $request)
{
    $validator = Validator::make($request->all(), [
        'client_id'       => 'required|exists:subcategories,id',
        'subcategory_name'=> 'required|string',
        'category_id'     => 'required|integer|exists:categories,id',
        'page'            => 'nullable|integer|min:1',
        'length'          => 'nullable|integer|min:1',
    ]);

    try {
        if ($validator->fails()) {
            $this->code = 1;
            throw new Exception($validator->errors()->first());
        }

        $id             = $request->client_id;
        $subcategory    = Subcategory::find($id);

        if (!$subcategory) {
            $this->code = 104;
            throw new Exception("Subcategory tidak ditemukan.");
        }

        $oldData = $subcategory->toArray();

        // UPDATE DATA
        $subcategory->update([
            'subcategory_name' => $request->subcategory_name,
            'category_id'      => $request->category_id,
        ]);

        // LOG
        UserActivity::create([
            "id"            => Uuid::uuid1(),
            "username"      => Auth::user()->username,
            "description"   => "Edit Subcategory: ".$request->subcategory_name,
            "activity_type" => 2,
            "old_data"      => $oldData,
            "created_by"    => Auth::user()->username,
        ]);

        // RELOAD LIST
        $page   = $request->input('page', 1);
        $length = $request->input('length', 10);
        $offset = $length * ($page - 1);

        $query = Subcategory::with('category');

        $response = [
            "total" => $query->count(),
            "item"  => $query->orderByDesc('created_at')->skip($offset)->take($length)->get(),
            "flash" => "Subcategory berhasil diEdit!",
        ];

        $this->code    = 0;
        $this->message = "";
        $this->dataMsg = $response;

    } catch (Exception $e) {
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
        'id'     => 'required|exists:subcategories,id',
        'page'   => 'nullable|integer|min:1',
        'length' => 'nullable|integer|min:1',
    ]);

    try {
        if ($validator->fails()) {
            $this->code = 1;
            throw new Exception($validator->errors()->first());
        }

        $id     = $request->id;
        $page   = $request->input('page', 1);
        $length = $request->input('length', 10);

        $subcategory = Subcategory::find($id);

        if (!$subcategory) {
            $this->code = 104;
            throw new Exception("Subcategory tidak ditemukan.");
        }

        $subcategory_name = $subcategory->subcategory_name;

        // CEK apakah subcategory dipakai oleh produk
        $usedByProducts = Product::where('subcategory_id', $subcategory->id)->exists();

        if ($usedByProducts) {
            $this->code = 1;
            throw new Exception("Subcategory '$subcategory_name' tidak dapat dihapus karena digunakan oleh produk.");
        }

        // DELETE PERMANEN
        $subcategory->delete();

        // Activity Log
        UserActivity::create([
            "id"            => Uuid::uuid1(),
            "username"      => Auth::user()->username,
            "description"   => "Hapus subcategory " . $subcategory_name,
            "activity_type" => 3,
            "created_by"    => Auth::user()->username,
        ]);

        // Reload list
        $query = Subcategory::with('category');
        $offset = $length * ($page - 1);

        $response = [
            "total" => $query->count(),
            "item"  => $query->orderByDesc('created_at')->skip($offset)->take($length)->get(),
            "flash" => "Subcategory $subcategory_name berhasil dihapus.",
        ];

        $this->code = 0;
        $this->message = "";
        $this->dataMsg = $response;

    } catch (Exception $e) {
        $this->message = $e->getMessage();
    }

    return $this->createResponse($this->dataMsg, $this->code, $this->message);
}




}
