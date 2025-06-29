<?php

namespace App\Http\Controllers;

use App\Models\AkunBank;
use App\Models\Customer;
use App\Models\Invoices;
use App\Models\Pembayaran;
use App\Models\UserActivity;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;

class PembayaranController extends Controller
{
    public function listPembayaranView(){
        return Inertia::render('Pembayaran/list-user-pembayaran', [
        ]);
    }
    public function listPembayaranUserView(){
        return Inertia::render('Pembayaran/list-user-detail-pembayaran', [
        ]);
    }
    public function PembayaranView(){
        $bank = AkunBank::where('is_deleted',0)->get();
        return Inertia::render('Pembayaran/index', [
            'bank'=>$bank
        ]);
    }

    public function listCustomerPembayaran(Request $request)
    {
        $length     = $request->input('length', 10);
        $page       = $request->input('page', 1);
        $username   = $request->input('username');
    
        $validator = Validator::make($request->all(), [
            'length'    => 'required|integer|min:1|max:100',
            'page'      => 'required|integer|min:1',
            'username'  => 'nullable|string',
        ]);
    
        try {
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
    
            $query = Customer::with('activeInvoices')
                ->where('is_deleted', 0);
    
            if ($username) {
                $query->where('nama', 'LIKE', "%$username%");
            }
    
            // Clone for total count before pagination
            $total = $query->count();
    
            // Ambil data dengan pagination
            $customers = $query
            ->orderBy('nama', 'asc')
                ->offset(($page - 1) * $length)
                ->limit($length)
                ->get();

            // Hitung sisa, lalu filter hanya yang sisa > 0
            $customers = $customers
                ->map(function ($customer) {
                    $totalGrand = $customer->activeInvoices->sum('grand_total');
                    $totalBayar = $customer->activeInvoices->sum('total_bayar');
                    $selisih = $totalGrand - $totalBayar;

                    $customer->sisa = $selisih > 0 ? $selisih : 0;

                    unset($customer->activeInvoices);
                    return $customer;
                })
                 ->filter(function ($customer) {
                     return $customer->sisa > 0;
                 })
                ->values(); // Penting: reset index agar hasil bersih
    
            $response = [
                "total" => $total,
                "item"  => $customers,
            ];
    
            $this->dataMsg  = $response;
            $this->code     = 0;
    
        } catch (Exception $e) {
            $this->message = $e->getMessage();
        }
    
        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }
    public function listPembayaranUser(Request $request)
{
    $length     = $request->input('length', 10);
    $page       = $request->input('page', 1);
    $username   = $request->input('username');
    $startDate  = $request->input('startDate');
    $endDate    = $request->input('endDate');

    $validator = Validator::make($request->all(), [
        'length'     => 'required|integer|min:1|max:100',
        'page'       => 'required|integer|min:1',
        'username'   => 'nullable|string',
        'startDate'  => 'nullable|date',
        'endDate'    => 'nullable|date|after_or_equal:startDate',
    ]);

    try {
        if ($validator->fails()) {
            $this->code = 1;
            throw new Exception($validator->errors()->first());
        }

        $query = Pembayaran::with(['bank', 'invoice.customer', 'createdByUser'])
            ->where('is_deleted', 0);

        if ($username) {
            $query->where(function ($q) use ($username) {
                $q->whereHas('invoice', function ($q1) use ($username) {
                    $q1->where('nomor_invoice', 'LIKE', "%$username%");
                })->orWhereHas('invoice.customer', function ($q2) use ($username) {
                    $q2->where('nama', 'LIKE', "%$username%");
                });
            });
        }

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $total = $query->count();

        $pembayaran = $query
            ->orderBy('created_at', 'desc')
            ->offset(($page - 1) * $length)
            ->limit($length)
            ->get();

        $response = [
            "total" => $total,
            "item"  => $pembayaran,
        ];

        $this->dataMsg  = $response;
        $this->code     = 0;

    } catch (Exception $e) {
        $this->message = $e->getMessage();
    }

    return $this->createResponse($this->dataMsg, $this->code, $this->message);
}
    

    public function deletePembayaran(Request $request)
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
            $itemInfo   = Pembayaran::where('id',$id)->with(['invoice'])->where('is_deleted',0)->first();
            $invoice   = Invoices::where('id',$itemInfo->invoice_id)->where('is_deleted',0)->first();
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

            $updateData2 = [
                "total_bayar" => $invoice->total_bayar - $itemInfo->nominal
            ];

            $itemInfo->update($updateData);
            $invoice->update($updateData2);

            $itemInfo->save();

            UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => Auth::user()->username,
                "description"   => "Hapus Pembayaran Berhasil invoice ".$itemInfo->invoice->nomor_invoice,
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

    public function listInvoicesPembayaran(Request $request)
        {
            $id = $request->input('id');

            $validator = Validator::make($request->all(), [
                'id' => 'required|string|size:36',
            ]);

            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            try {
                $customer = Customer::where('id',$id)->where('is_deleted',0)->first();
                $items = Invoices::with([
                    'customer',
                    'sales',
                    'updatedByUser',
                    'createdByUser',
                    'pembayaran.bank'
                ])
                ->where('is_deleted', 0)
                ->where('customer_id', $id)
                ->get()
                ->map(function ($invoice) {
                    $invoice->sisa = $invoice->grand_total - $invoice->total_bayar;
                    $invoice->nominal_bayar = 0;
                    $invoice->bank_id = null;
                    $invoice->catatan_bayar = null;
                    $invoice->tgl_bayar = now()->format('Y-m-d\TH:i');
                    return $invoice;
                })
                ->filter(function ($invoice) {
                    return $invoice->sisa > 0;
                })
                ->values(); // untuk reset index agar clean jika dikembalikan sebagai JSON
            
            $total_piutang = $items->sum('sisa');
            $total_pembayaran = $items->sum('nominal_bayar');

                if (!$items) {
                    $this->code = 1;
                    throw new Exception("Invoice tidak ditemukan.");
                }

                $this->dataMsg = [
                    "items" => $items,
                    "namaCustomer" => $customer->nama??null,
                ];
                $this->code = 0;

            } catch (Exception $e) {
                $this->message = $e->getMessage();
            }

            return $this->createResponse($this->dataMsg, $this->code, $this->message);
        }

    public function createPembayaran(Request $request)
        {
            $data = $request->input('data');

            if (!is_array($data)) {
                return response()->json([
                    'code' => 1,
                    'msg' => 'Format data tidak valid.',
                ], 422);
            }

            $validatedData = [];
            foreach ($data as $index => $item) {
                $validator = Validator::make($item, [
                    'invoice_id'     => 'required',
                    'nomor_invoice'     => 'required',
                    'nominal_bayar'  => 'required|numeric|min:1',
                    'bank_id'        => 'required|exists:akun_banks,id',
                    'tgl_bayar'      => 'required|date_format:Y-m-d\TH:i',
                    'catatan_bayar'  => 'nullable|string|max:255',
                ]);

                if ($validator->fails()) {
                    return response()->json([
                        'code' => 1,
                        'msg' => "Baris ke-".($index+1).": ".$validator->errors()->first(),
                    ], 422);
                }

                $validatedData[] = $validator->validated();
            }

            // Simpan semua pembayaran
            foreach ($validatedData as $item) {
                $invoice = Invoices::where('id',$item['invoice_id'])->where('is_deleted',0)->first();
                Pembayaran::create([
                    "id"            => Uuid::uuid1(),
                    'invoice_id'    => $item['invoice_id'],
                    'nominal'       => $item['nominal_bayar'],
                    'akun_bank_id'  => $item['bank_id'],
                    'created_at'     => Carbon::createFromFormat('Y-m-d\TH:i', $item['tgl_bayar']),
                    'catatan'       => $item['catatan_bayar'],
                    'created_by'    => Auth::user()->id, // jika pakai auth
                ]);

                  // Update total_bayar pada invoice
                $invoice->total_bayar = (float) $invoice->total_bayar + (float) $item['nominal_bayar'];
                $invoice->save();

                UserActivity::create([
                    "id"            => Uuid::uuid1(),
                    "username"      => Auth::user()->username,
                    "description"   => "add pembayaran invoice ".$item['nomor_invoice'],
                    "activity_type" => (int) 1,
                    "created_by"    => Auth::user()->username,
                    
                ]);
            }

            return response()->json([
                'code' => 0,
                'data' => [
                    'flash' => 'Berhasil menyimpan semua pembayaran.',
                ]
            ]);
        }

}
