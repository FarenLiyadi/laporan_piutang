<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\UserActivity;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;
use Illuminate\Support\Str;

class CustomersController extends Controller
{
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Customers/Index',[
            
        ]);
    }

    public function listCustomers(Request $request)
    {
        $length     = $request->input('length', 10);
        $page       = $request->input('page', 1);
        $namaPaket  = $request->input('namaPaket');
        $is_disabled  = $request->input('is_disabled');
        $kondisi  = $request->input('kondisi');
    
        $validator = Validator::make($request->all(), [
            'length'    => 'required|integer|min:1|max:100',
            'page'      => 'required|integer|min:1',
            'namaPaket' => 'nullable|string',
            'is_disabled' => 'nullable|in:0,1,2',
            'kondisi'     => 'nullable|in:0,1,2',
        ]);
    
        try {
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
    
            $offset = $length * ($page - 1);
    
            // Bangun query dasar
            $query = Customer::with('invoices')
                ->where('is_deleted', 0);
    
            // Filter jika ada namaPaket
            if ($namaPaket) {
                $query->where(function ($q) use ($namaPaket) {
                    $q->where('nama', 'LIKE', "%$namaPaket%")
                      ->orWhere('no_hp', 'LIKE', "%$namaPaket%");
                });
            }
            if ($is_disabled == 0 || $is_disabled == 1 ) {
                $query->where('is_enabled',$is_disabled);
            }
    
            // Ambil semua data dulu (untuk filter status manual)
            $allCustomers = $query->orderByDesc('created_at')->get();
    
            // Tambahkan status
            $filteredCustomers = $allCustomers->map(function ($customer) {
                $status = true;
    
                foreach ($customer->invoices as $invoice) {
                    $jatuhTempo = Carbon::parse($invoice->jatuh_tempo)->addMonths(6);
    
                    if (
                        $invoice->grand_total > $invoice->total_bayar &&
                        $jatuhTempo->lt(now())
                    ) {
                        $status = false;
                        break;
                    }
                }
    
                // Tambahkan status sebagai properti
                $customer->setAttribute('status', $status);
                return $customer;
            });
    
             // ✅ Filter berdasarkan kondisi (lunas/kredit)
            if ($kondisi === 0 || $kondisi === 1 || $kondisi === '0' || $kondisi === '1') {
                $filteredCustomers = $filteredCustomers->filter(function ($item) use ($kondisi) {
                    return (int)$item->status === (int)$kondisi;
                })->values();
            }

            // Total semua
            $total = $filteredCustomers->count();
    
            // Ambil halaman sesuai offset
            $items = $filteredCustomers->slice($offset, $length)->values();
    
            $this->dataMsg = [
                'total' => $total,
                'item'  => $items,
            ];
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

        $nama = $request->input('nama');
        $alamat = $request->input('alamat');
        $is_enabled = $request->input('is_enabled');
        $no_hp = $request->input('no_hp');
        $document = $request->file('document');
        $page       = $request->input('page', 1);
        $length     = $request->input('length', 10);

        $validator = Validator::make($request->all(), [
            'nama'      => 'required|string',
            'alamat'      => 'required|string',
            'no_hp'      => 'required|string',
            'is_enabled'      => 'required',
            'page'=>'nullable',
            'length'=>'nullable',
            
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
            $documentName="";
            if ($request->hasFile('document')) {
                // Handle the new file upload
                $file = $request->file('document');
                $timestamp = now()->format('YmdHis'); // Generate a timestamp
                $filename = $timestamp . '_' . $file->getClientOriginalName();
            
                // Ensure the username is valid and build the path
               
                $directory = 'uploads/' . Str::slug($nama);
            
                // Store the file
                $path = $file->storeAs($directory, $filename, 'public');
            
                // Generate the public URL for the stored file
                $documentName = Storage::url($path);
            }



            Customer::create([
               
                "nama"      => $nama,
                "no_hp"      => $no_hp,
                "alamat"      => $alamat,
                "is_enabled"      => $is_enabled,
                "created_by"      => Auth::user()->id,
                "document"      => $documentName,
       
                
            ]);
             // User Activity
             UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => Auth::user()->username,
                "description"   => "Create New customer ".$nama,
                "activity_type" => (int) 1,
                "created_by"    => Auth::user()->username,
            ]);

        
            $offset     = $length * ($page - 1);
            $itemInfo   = Customer::where('is_deleted',0);

            $response = [
                "total" => $itemInfo->count(),
                "item"  => $itemInfo->orderByDesc('created_at')->skip($offset)->take($length)->get(),
                "flash" => "Data Customer berhasil ditambahkan!",
                
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
        $nama = $request->input('nama');
        $alamat = $request->input('alamat');
        $is_enabled = $request->input('is_enabled');
        $no_hp = $request->input('no_hp');
        $document = $request->file('document');
        $page       = $request->input('page', 1);
        $length     = $request->input('length', 10);

        $validator = Validator::make($request->all(), [
            'client_id'      => 'required',
            'nama'      => 'required|string',
            'alamat'      => 'required|string',
            'is_enabled'      => 'required',
            'no_hp'      => 'required|string',
            'page'=>'nullable',
            'length'=>'nullable',
            
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            $itemInfo = Customer::where('id',$client_id)->first();
            if (!$itemInfo){
                $this->code = 104;
                throw new Exception($this->getErrorMessage($this->code));
            }
            $oldData =  $itemInfo->toArray();
            $documentName = $itemInfo->document ?? '';

            if ($request->hasFile('document')) {

                if (!empty($documentName)) {
                    $existingFilePath = substr($documentName,8);
                    $old_file = public_path($documentName); // Path in public storage
                    if (Storage::disk('public')->exists($existingFilePath) && file_exists($old_file)) {
                        // Storage::delete($existingFilePath);
                        Storage::disk('public')->delete($existingFilePath);
                        Log::info('✅ File berhasil dihapus.');
                    } else {
                        Log::warning('❌ File tidak ditemukan.');
                    }
                }
            
                $file = $request->file('document');
                $timestamp = now()->format('YmdHis');
                $originalName = str_replace(['+', ' '], '_', $file->getClientOriginalName()); // penting!
                $filename = $timestamp . '_' . $originalName;
            
                $directory = 'uploads/' . Str::slug($nama); // pastikan $nama valid
                $path = $file->storeAs($directory, $filename, 'public');
            
                $documentName = Storage::url($path); // simpan URL ke DB
            }

           
          


            $updateData = [
                "nama"      => $nama,
                "no_hp"      => $no_hp,
                "is_enabled"      => $is_enabled,
                "alamat"      => $alamat,
                "updated_by"      => Auth::user()->id,
                "document"      => $documentName,
            ];

            $itemInfo->update($updateData);
            $itemInfo->save();
             // User Activity
             UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => Auth::user()->username,
                "description"   => "Edit customer ".$nama,
                "activity_type" => (int) 2,
                "old_data"      => $oldData,
                "created_by"    => Auth::user()->username,
            ]);

        
            $offset     = $length * ($page - 1);
            $itemInfo2   = Customer::where('is_deleted',0);

            $response = [
                "total" => $itemInfo2->count(),
                "item"  => $itemInfo2->orderByDesc('created_at')->skip($offset)->take($length)->get(),
                "flash" => "Data Customer berhasil diEdit!",
                
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
  public function accessFile ($id){
    $client_id = $id;

       
    if (!$client_id){
        abort(404);
    }

        $itemInfo = Customer::where('id',$client_id)->first();

        if (!$itemInfo->document){
            abort(404);
        }
        $documentName = $itemInfo->document ?? '';

        $filePath = public_path($documentName);
        if (file_exists($filePath)) {
            return response()->download($filePath);
        } else {
            abort(404);
        }

    
        }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $id = $request->input('id');
        $page       = $request->input('page', 1);
        $length     = $request->input('length', 10);

        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'page'=>'required',
            'length'=>'required',
            
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
          

          

        
            $offset     = $length * ($page - 1);
            $itemInfo   = Customer::where('id',$id)->where('is_deleted',0)->first();
            $nama = $itemInfo->nama;

            if (!$itemInfo){
                $this->code = 104;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $updateData = [
                "is_deleted" => 1, 
                "deleted_by"  => Auth::user()->id,   
                "deleted_at"  => Carbon::now(),   
            ];
            $itemInfo->update($updateData);
            

            $itemInfo->save();

            UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => Auth::user()->username,
                "description"   => "Hapus customer ".$nama,
                "activity_type" => (int) 3,
                "created_by"    => Auth::user()->username,
                
            ]);


            $itemLoad   = Customer::where('is_deleted',0);

            $response = [
                "total" => $itemLoad->count(),
                "item"  => $itemLoad->orderByDesc('created_at')->skip($offset)->take($length)->get(),
                "flash" => "Data customer ".$nama." berhasil dihapus!",
                
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

}
