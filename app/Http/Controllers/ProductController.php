<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Pembayaran;
use App\Models\Sales;
use App\Models\Subcategory;
use App\Models\Unit;
use App\Models\User;
use App\Models\UserActivity;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;

class ProductController extends Controller
{
    // View Section
    public function listProductView(){
          $category = Category::
            where('deleted_at', null)
            ->get()
            ->map(function ($cust) {
                return [
                    'value' => $cust->id,
                    'label' => $cust->category_name,
                ];
            });
          $brand = Brand::
            where('deleted_at', null)
            ->get()
            ->map(function ($cust) {
                return [
                    'value' => $cust->id,
                    'label' => $cust->brand_name,
                ];
            });
        return Inertia::render('Product/list-product', [
             'categoryList'=>$category,
             'brandList'=>$brand,
        ]);
    }

  public function createProductView()
{
    $brands = Brand::where('deleted_at', null)
        ->get()
        ->map(fn($b) => [
            'value' => $b->id,
            'label' => $b->brand_name
        ]);

    $categories = Category::get()
        ->map(fn($c) => [
            'value' => $c->id,
            'label' => $c->category_name
        ]);

    $subcategories = Subcategory::with('category')->get()
        ->map(fn($s) => [
            'value' => $s->id,
            'label' => $s->subcategory_name . " ({$s->category->category_name})"
        ]);

    $units = Unit::get()
        ->map(fn($u) => [
            'value' => $u->id,
            'label' => $u->unit_name
        ]);

    return Inertia::render('Product/create-product', [
        'brandList'        => $brands,
        'categoryList'     => $categories,
        'subcategoryList'  => $subcategories,
        'unitList'         => $units,
    ]);
}
public function getSubcategoryByCategory(Request $request)
{
    $category_id = $request->input('category_id');

    if (!$category_id) {
        return response()->json([
            'code' => 1,
            'msg' => 'Category ID tidak ditemukan',
            'data' => []
        ]);
    }

    $subs = Subcategory::where('category_id', $category_id)->whereNull('deleted_at')
        ->orderBy('subcategory_name')
        ->get()
        ->map(fn($s) => [
            'value' => $s->id,
            'label' => $s->subcategory_name
        ]);

    return response()->json([
        'code' => 0,
        'data' => $subs
    ]);
}


  

   public function updateProductView(Request $request)
{
    $id = $request->query('id');

    $product = Product::where('id', $id)->where('deleted_at', null)->first();
    if (!$product) return abort(404);

    return Inertia::render('Product/update-product', [
        'brandList'      => Brand::get()->map(fn($b) => ['value'=>$b->id, 'label'=>$b->brand_name]),
        'categoryList'   => Category::get()->map(fn($c) => ['value'=>$c->id, 'label'=>$c->category_name]),
        'subcategoryList'=> Subcategory::get()->map(fn($s) => ['value'=>$s->id, 'label'=>$s->subcategory_name, 'category_id'=>$s->category_id]),
        'unitList'       => Unit::get()->map(fn($u) => ['value'=>$u->id, 'label'=>$u->unit_name]),
        'product'        => $product,
    ]);
}

    // End View Section

    // API Section
  public function listProduct(Request $request)
{
    $validator = Validator::make($request->all(), [
        'length'         => 'required|integer|min:1|max:100',
        'page'           => 'required|integer|min:1',
        'search'         => 'nullable|string',
        'brand_id'       => 'nullable|integer|exists:brands,id',
        'category_id'    => 'nullable|integer|exists:categories,id',
        'subcategory_id' => 'nullable|integer|exists:subcategories,id',
        'unit_id'        => 'nullable|integer|exists:units,id',
    ]);

    try {
        if ($validator->fails()) {
            $this->code = 1;
            throw new Exception($validator->errors()->first());
        }

        $length  = $request->input('length', 10);
        $page    = $request->input('page', 1);
        $offset  = $length * ($page - 1);

        $search         = $request->input('search');
        $brand_id       = $request->input('brand_id');
        $category_id    = $request->input('category_id');
        $subcategory_id = $request->input('subcategory_id');
        $unit_id        = $request->input('unit_id');

        // BASE QUERY
        $query = Product::with(['brand', 'category', 'subcategory', 'unit'])
            ->whereNull('deleted_at');

        // --- FILTER UTAMA ---
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'LIKE', "%$search%")
                  ->orWhere('product_code', 'LIKE', "%$search%")
                  ->orWhere('wholesale_code', 'LIKE', "%$search%");
            });
        }

        if ($brand_id) {
            $query->where('brand_id', $brand_id);
        }

        if ($category_id) {
            $query->where('category_id', $category_id);
        }

        if ($subcategory_id) {
            $query->where('subcategory_id', $subcategory_id);
        }

        if ($unit_id) {
            $query->where('unit_id', $unit_id);
        }

        // --- RESPONSE ---
        $response = [
            "total" => $query->count(),
            "item"  => $query->orderByDesc('created_at')
                            ->skip($offset)
                            ->take($length)
                            ->get(),
        ];

        $this->dataMsg = $response;
        $this->code = 0;

    } catch (Exception $e) {
        $this->message = $e->getMessage();
    }

    return $this->createResponse($this->dataMsg, $this->code, $this->message);
}

private function generateProductCode()
{
    $last = Product::where('product_code', 'LIKE', 'SGK-%')
        ->whereRaw("product_code REGEXP '^SGK-[0-9]{5}$'")
        ->orderBy('product_code', 'desc')
        ->value('product_code');

    // Jika belum ada auto-code
    if (!$last) {
        return 'SGK-00001';
    }

    // Ambil angka 5 digit paling belakang
    $num = intval(substr($last, 4)); // mulai setelah 'SGK-'

    // Naikkan sequence
    $next = $num + 1;

    // Format lagi: SGK-00001
    return 'SGK-' . str_pad($next, 5, '0', STR_PAD_LEFT);
}













   public function createProduct(Request $request)
{
    $validator = Validator::make($request->all(), [
        'product_code'          => 'nullable|string|unique:products,product_code',
        'product_name'          => 'required|string|max:255',
        'brand_id'              => 'required|integer|exists:brands,id',
        'category_id'           => 'required|integer|exists:categories,id',
        'subcategory_id'        => 'nullable|integer|exists:subcategories,id',
        'unit_id'               => 'required|integer|exists:units,id',
        'retail_price'          => 'required|numeric|min:0',
        'wholesale_item_code'   => 'nullable|string|max:50',
    ]);

    try {
        if ($validator->fails()) {
            $this->code = 1;
            throw new Exception($validator->errors()->first());
        }

            // USER KOSONGKAN KODE → AUTO GENERATE
        $productCode = $request->product_code;
        if (empty($productCode)) {
            $productCode = $this->generateProductCode();
        }

       $product = Product::create([
    'product_code'       => $productCode,
    'product_name'       => $request->product_name,
    'brand_id'           => $request->brand_id,
    'category_id'        => $request->category_id,
    'subcategory_id'     => $request->subcategory_id,
    'unit_id'            => $request->unit_id,
    'retail_price'       => $request->retail_price,
    'wholesale_code'     => $request->wholesale_code,

]);


        UserActivity::create([
            "id"            => Uuid::uuid1(),
            "username"      => Auth::user()->username,
            "description"   => "Create Product ".$product->product_name,
            "activity_type" => UserActivity::CREATE,
            "created_by"    => Auth::user()->id,
        ]);

        $this->code = 0;
        $this->message = "Product berhasil ditambahkan!";
    }
    catch (Exception $e) {
        $this->message = $e->getMessage();
    }

    return $this->createResponse($this->dataMsg, $this->code, $this->message);
}


    

public function updateProduct(Request $request) {
    $validator = Validator::make($request->all(), [
        'id' => 'required|integer|exists:products,id',
        'product_name' => 'required|string',
        'brand_id' => 'required|integer',
        'category_id' => 'required|integer',
        'subcategory_id' => 'nullable|integer',
        'unit_id' => 'required|integer',
        'retail_price' => 'required|numeric|min:1',
        'product_code' => 'nullable|string|max:50|unique:products,product_code,' . $request->id,
        'wholesale_code' => 'nullable|string|max:50',
    ]);

    try {
        if ($validator->fails()) {
            $this->code = 1;
            throw new Exception($validator->errors()->first());
        }

        $product = Product::findOrFail($request->id);

        // generate product code when empty
        if (empty($request->product_code)) {
            $product->product_code = $this->generateProductCode();
        } else {
            $product->product_code = $request->product_code;
        }

        $product->product_name = $request->product_name;
        $product->brand_id = $request->brand_id;
        $product->category_id = $request->category_id;
        $product->subcategory_id = $request->subcategory_id;
        $product->unit_id = $request->unit_id;
        $product->retail_price = $request->retail_price;
        $product->wholesale_code = $request->wholesale_code;
        $product->save();

        // LOG — gunakan UPDATE
        UserActivity::create([
            "id"            => Uuid::uuid1(),
            "username"      => Auth::user()->username,
            "description"   => "Update Product: " . $product->product_name,
            "activity_type" => UserActivity::UPDATE,
            "created_by"    => Auth::user()->id,
        ]);

        $this->code = 0;
        $this->message = "Product berhasil diupdate!";
        $this->dataMsg = [
            "id" => $product->id,
            "product_code" => $product->product_code,
        ];

    } catch (Exception $e) {
        $this->code = 1;
        $this->message = $e->getMessage();
    }

    return $this->createResponse($this->dataMsg, $this->code, $this->message);
}






  public function deleteProduct(Request $request)
{
    $validator = Validator::make($request->all(), [
        'item_id' => 'required|exists:products,id',
    ]);

    if ($validator->fails()) {
        return $this->createResponse(null, 1, $validator->errors()->first());
    }

    try {
        $product = Product::where('id', $request->item_id)->first();

        if (!$product) {
            return $this->createResponse(null, 104, "Produk tidak ditemukan.");
        }

        $product->delete(); // ← Soft delete resmi Laravel
        

        UserActivity::create([
            "id"            => Uuid::uuid1(),
            "username"      => Auth::user()->username,
            "description"   => "Delete Product: " . $product->product_name,
            "activity_type" => UserActivity::DELETE,
            "created_by"    => Auth::user()->id,
        ]);

        return $this->createResponse(null, 0, "Produk berhasil dihapus.");
    }
    catch (Exception $e) {
        return $this->createResponse(null, 1, $e->getMessage());
    }
}

public function labelView()
{
    $products = Product::with(['brand','unit','category'])
        ->whereNull('deleted_at')
        ->orderBy('product_name')
        ->get()
        ->map(function ($p) {
            return [
                'id' => $p->id,
                'product_name' => $p->product_name,
                'product_code' => $p->product_code,
                'wholesale_code' => $p->wholesale_code,
                'unit_name' => $p->unit->unit_name ?? null,
                'retail_price' => $p->retail_price,
            ];
        });

    return Inertia::render('Product/LabelCart', [
        'productList' => $products,
    ]);
}

public function searchProduct(Request $request)
{
    $query = $request->query('q');

    if (!$query || strlen($query) < 2) {
        return $this->createResponse([], 0, "OK");
    }

    $products = Product::whereNull('deleted_at')
        ->where(function ($q2) use ($query) {
            $q2->where('product_name', 'LIKE', "%$query%")
               ->orWhere('product_code', 'LIKE', "%$query%");
        })
        ->limit(20)
        ->get();

    // 🔥 Jika kosong, kirim item dummy
    if ($products->isEmpty()) {
        return $this->createResponse([
            [
                'id' => null,
                'product_name' => 'No data match',
                'product_code' => '',
                'wholesale_code' => '',
                'unit_name' => '',
                'retail_price' => 0,
                'disabled' => true, // frontend bisa cek ini
            ]
        ], 0, "OK");
    }

    $mapped = $products->map(function ($p) {
        return [
            'id' => $p->id,
            'product_name' => $p->product_name,
            'product_code' => $p->product_code,
            'wholesale_code' => $p->wholesale_code,
            'unit_name' => $p->unit->unit_name ?? '-',
            'retail_price' => $p->retail_price,
            'disabled' => false,
        ];
    });

    return $this->createResponse($mapped, 0, "OK");
}


    // End API Section
}
