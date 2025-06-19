<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;
use App\Models\AkunBank;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AkunBankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Bank/Index',[
            
        ]);
    }

    public function listBank(Request $request)
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
            $itemInfo   = AkunBank::query()->where('is_deleted',0);

            if ($namaPaket) { $itemInfo->where('nama_bank', 'LIKE', "%$namaPaket%"); }
            

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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $nama_bank = $request->input('nama_bank');
        $page       = $request->input('page', 1);
        $length     = $request->input('length', 10);

        $validator = Validator::make($request->all(), [
            'nama_bank'      => 'required|string',
            'page'=>'nullable',
            'length'=>'nullable',
            
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
            AkunBank::create([
               
                "nama_bank"      => $nama_bank,
       
                
            ]);
             // User Activity
             UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => Auth::user()->username,
                "description"   => "Create New account bank ".$nama_bank,
                "activity_type" => (int) 1,
                "created_by"    => Auth::user()->username,
            ]);

        
            $offset     = $length * ($page - 1);
            $itemInfo   = AkunBank::where('is_deleted',0);

            $response = [
                "total" => $itemInfo->count(),
                "item"  => $itemInfo->orderByDesc('created_at')->skip($offset)->take($length)->get(),
                "flash" => "Data bank berhasil ditambahkan!",
                
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
    public function show(AkunBank $akunBank)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AkunBank $akunBank)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AkunBank $akunBank)
    {
        //
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
            $itemInfo   = AkunBank::where('id',$id)->where('is_deleted',0)->first();

            if (!$itemInfo){
                $this->code = 104;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $updateData = [
                "is_deleted" => 1,       
            ];
            $itemInfo->update($updateData);
            

            $itemInfo->save();

            $itemLoad   = AkunBank::where('is_deleted',0);

            $response = [
                "total" => $itemLoad->count(),
                "item"  => $itemLoad->orderByDesc('created_at')->skip($offset)->take($length)->get(),
                "flash" => "Data bank berhasil dihapus!",
                
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
