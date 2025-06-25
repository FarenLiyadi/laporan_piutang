<?php

namespace App\Http\Controllers;

use App\Models\Sales;
use App\Models\UserActivity;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Ramsey\Uuid\Uuid;

class SalesController extends Controller
{
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Sales/Index',[
            
        ]);
    }

    public function listSales(Request $request)
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
            $itemInfo   = Sales::query()->where('is_deleted',0);

            if ($namaPaket) {
                $itemInfo->where(function ($query) use ($namaPaket) {
                    $query->where('nama', 'LIKE', "%$namaPaket%")
                          ->orWhere('no_hp', 'LIKE', "%$namaPaket%");
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



            Sales::create([
               
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
                "description"   => "Create New Sales ".$nama,
                "activity_type" => (int) 1,
                "created_by"    => Auth::user()->username,
            ]);

        
            $offset     = $length * ($page - 1);
            $itemInfo   = Sales::where('is_deleted',0);

            $response = [
                "total" => $itemInfo->count(),
                "item"  => $itemInfo->orderByDesc('created_at')->skip($offset)->take($length)->get(),
                "flash" => "Data Sales berhasil ditambahkan!",
                
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

            $itemInfo = Sales::where('id',$client_id)->first();
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
                "description"   => "Edit sales ".$nama,
                "activity_type" => (int) 2,
                "old_data"      => $oldData,
                "created_by"    => Auth::user()->username,
            ]);

        
            $offset     = $length * ($page - 1);
            $itemInfo2   = Sales::where('is_deleted',0);

            $response = [
                "total" => $itemInfo2->count(),
                "item"  => $itemInfo2->orderByDesc('created_at')->skip($offset)->take($length)->get(),
                "flash" => "Data Sales berhasil diEdit!",
                
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

        $itemInfo = Sales::where('id',$client_id)->first();

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
            $itemInfo   = Sales::where('id',$id)->where('is_deleted',0)->first();
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
                "description"   => "Hapus sales ".$nama,
                "activity_type" => (int) 3,
                "created_by"    => Auth::user()->username,
                
            ]);


            $itemLoad   = Sales::where('is_deleted',0);

            $response = [
                "total" => $itemLoad->count(),
                "item"  => $itemLoad->orderByDesc('created_at')->skip($offset)->take($length)->get(),
                "flash" => "Data sales ".$nama." berhasil dihapus!",
                
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
