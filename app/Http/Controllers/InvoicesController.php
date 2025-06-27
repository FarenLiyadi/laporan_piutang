<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Invoices;
use App\Models\Pembayaran;
use App\Models\Sales;
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

class InvoicesController extends Controller
{
    // View Section
    public function listInvoicesView(){
        return Inertia::render('Invoices/list-invoices', [
        ]);
    }

    public function createInvoicesView(){
            $customers = Customer::where('is_deleted', 0)
        ->where('is_enabled', 1)
        ->with('invoices') // eager load invoice agar lebih efisien
        ->get()
        ->map(function ($cust) {
            $status = true;

            foreach ($cust->invoices as $invoice) {
                $jatuhTempo = Carbon::parse($invoice->jatuh_tempo)->addMonths(6);

                if (
                    $invoice->grand_total > $invoice->total_bayar &&
                    $jatuhTempo->lt(now())
                ) {
                    $status = false;
                    break;
                }
            }

            return [
                'value' => $cust->id,
                'label' => $cust->nama . ' (' . $cust->no_hp . ') (' . ($status ? 'sehat' : 'tidak sehat') . ')',
            ];
        });
            $sales = Sales::
            where('is_deleted', 0)->where('is_enabled',1)
            ->get()
            ->map(function ($cust) {
                return [
                    'value' => $cust->id,
                    'label' => $cust->nama . ' (' . $cust->no_hp . ')',
                ];
            });
            return Inertia::render('Invoices/create-invoices',  [
                'customerList' => $customers,
                'salesList' => $sales,
            ]);
    }

  

    public function updateInvoicesView(Request $request){
        $id = $request->query('id'); // Ambil dari URL query string

        $checked = Pembayaran::where("invoice_id",$id)->get();
        if (count($checked) > 0) {
            return abort(403);
        }

        $invoice = Invoices::where('id',$id)->where('is_deleted',0)->first();
        if(!$invoice){
            return abort(404);
        }
        $customers = Customer::where('is_deleted', 0)->where('id',$invoice->customer_id)
        ->where('is_enabled', 1)
        ->with('invoices') // eager load invoice agar lebih efisien
        ->get()
        ->map(function ($cust) {
            $status = true;

            foreach ($cust->invoices as $invoice) {
                $jatuhTempo = Carbon::parse($invoice->jatuh_tempo)->addMonths(6);

                if (
                    $invoice->grand_total > $invoice->total_bayar &&
                    $jatuhTempo->lt(now())
                ) {
                    $status = false;
                    break;
                }
            }

            return [
                'value' => $cust->id,
                'label' => $cust->nama . ' (' . $cust->no_hp . ') (' . ($status ? 'sehat' : 'tidak sehat') . ')',
            ];
        });
            $sales = Sales::
            where('is_deleted', 0)->where('is_enabled',1)
            ->get()
            ->map(function ($cust) {
                return [
                    'value' => $cust->id,
                    'label' => $cust->nama . ' (' . $cust->no_hp . ')',
                ];
            });
            $salesfix = Sales::
            where('is_deleted', 0)->where('is_enabled',1)->where('id',$invoice->sales_id)
            ->get()
            ->map(function ($cust) {
                return [
                    'value' => $cust->id,
                    'label' => $cust->nama . ' (' . $cust->no_hp . ')',
                ];
            });
            return Inertia::render('Invoices/update-invoices',  [
                'customerList' => $customers,
                'salesList' => $sales,
                'salesFix' => $salesfix,
                'invoice'=>$invoice
            ]);
    }
    // End View Section

    // API Section
    public function listInvoices(Request $request)
    {
        $length     = $request->input('length', 10);
        $page       = $request->input('page', 1);
        $namaClient   = $request->input('username');
        $status   = $request->input('status');
        $startDate   = $request->input('startDate');
        $endDate   = $request->input('endDate');
 

        $validator = Validator::make($request->all(), [
            'length'    => 'required|integer|min:1|max:100',
            'page'      => 'required|integer|min:1',
            'namaClient'  => 'nullable|string',
            'startDate' => 'nullable|date',
            'endDate' => 'nullable|date',
  
        ]);

        Try {
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
           

            $offset     = $length * ($page - 1);
           
            $itemInfo   = Invoices::with(['customer','sales','updatedByUser','createdByUser','pembayaran.bank'])->where('is_deleted',0);
       

            if ($namaClient) { $itemInfo->whereHas('customer', function ($query) use ($namaClient) { 
                // Log::debug('Item Info:', ['itemInfo' => $query->toSql()]);
                $query->where("nama", 'LIKE', "%$namaClient%"); 
            }
        )->orWhere('nomor_invoice', 'LIKE', "%$namaClient%");
        }
        if ($status == 2) {
            $itemInfo->whereColumn('grand_total', '<=', 'total_bayar');
        }
        if ($status == 1) {
            $itemInfo->whereColumn('grand_total', '>=', 'total_bayar');
        }

        if ($startDate && $endDate) {
            $itemInfo->whereBetween('tanggal_nota', [$startDate, $endDate]);
        } elseif ($startDate) {
            $itemInfo->whereDate('tanggal_nota', '>=', $startDate);
        } elseif ($endDate) {
            $itemInfo->whereDate('tanggal_nota', '<=', $endDate);
        }
            

            $response = [
                "total" => $itemInfo->count(),
                "item"  => $itemInfo->orderByDesc('tanggal_nota')->skip($offset)->take($length)->get(),
                
            ];
            $this->dataMsg  = $response;
            $this->code     = 0;
            
        } catch (Exception $e) {
            $this->message = $e->getMessage();
        }

        
        
        return $this->createResponse($this->dataMsg, $this->code, $this->message);
   


        
    }
    private function generateNomorInvoice($tanggalNota)
    {
        $tanggal = Carbon::parse($tanggalNota); // ubah dari string ke Carbon
        $tanggalFormat = $tanggal->format('dmy'); // Contoh: 270624
        $prefix = 'INV-' . $tanggalFormat;
    
        // Ambil bulan dan tahun dari tanggal yang dikirim
        $bulan = $tanggal->format('m');
        $tahun = $tanggal->format('Y');
    
        // Hitung jumlah invoice di bulan dan tahun yang sama
        $countThisMonth = Invoices::whereYear('tanggal_nota', $tahun)
            ->whereMonth('tanggal_nota', $bulan)
            ->count();
    
        $sequence = str_pad($countThisMonth + 1, 4, '0', STR_PAD_LEFT);
    
        return $prefix . '-' . $sequence;
    }

    public function createInvoices(Request $request){
        $customer       = $request->input('customer');
        $sales      = $request->input('sales');
        $jatuh_tempo        = $request->input('jatuh_tempo');
        $tanggal_nota       = $request->input('tanggal_nota');
        $grand_total        = $request->input('grand_total');
        $nomor_invoice      = $request->input('nomor_invoice');
        $catatan        = $request->input('catatan');
        Log::info($customer);

        $validator = Validator::make($request->all(), [
            'customer'                   => 'required|string|min:36|max:36',
            'sales'                    => 'nullable|string|min:36|max:36',
            'jatuh_tempo'        => 'required|date',
            'tanggal_nota'         => 'required|date',
            'grand_total'         => 'required|integer',
            'catatan'        => 'nullable|string',
            'nomor_invoice'        => 'nullable|string',
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
            if (empty($nomor_invoice)) {
                $nomor_invoice = $this->generateNomorInvoice($tanggal_nota);
            }
        $customerName = Customer::where('id',$customer)->first();
            // Simpan ke database
            $invoice = new Invoices();
            $invoice->id    = Uuid::uuid1();
            $invoice->customer_id    = $customer;
            $invoice->sales_id       = $sales;
            $invoice->jatuh_tempo    = $jatuh_tempo;
            $invoice->tanggal_nota   = $tanggal_nota;
            $invoice->grand_total    = $grand_total;
            $invoice->nomor_invoice  = $nomor_invoice;
            $invoice->catatan        = $catatan;
            $invoice->created_by        = Auth::user()->id;
            $invoice->save();
            

            // Admin Acitvity
            UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      =>Auth::user()->username ,
                "description"   => "Add New Data invoice " . $customerName->nama. " ".$nomor_invoice,
                "activity_type" => UserActivity::CREATE,
                "created_by"    => Auth::user()->id,
            ]);

            $this->code = 0;
            $this->message = "Add New Invoices Success";
        }catch(Exception $e){
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    

    public function updateInvoices(Request $request){
        $customer       = $request->input('customer');
        $sales      = $request->input('sales');
        $jatuh_tempo        = $request->input('jatuh_tempo');
        $tanggal_nota       = $request->input('tanggal_nota');
        $grand_total        = $request->input('grand_total');
        $nomor_invoice      = $request->input('nomor_invoice');
        $catatan        = $request->input('catatan');
        $id        = $request->input('id');
        

        $validator = Validator::make($request->all(), [
            'customer'                   => 'required|string|min:36|max:36',
            'id'                   => 'required|string|min:36|max:36',
            'sales'                    => 'nullable|string|min:36|max:36',
            'jatuh_tempo'        => 'required|date',
            'tanggal_nota'         => 'required|date',
            'grand_total'         => 'required|integer',
            'catatan'        => 'nullable|string',
            'nomor_invoice'        => 'nullable|string',
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
            if (empty($nomor_invoice)) {
                $nomor_invoice = $this->generateNomorInvoice($tanggal_nota);
            }
        $customerName = Customer::where('id',$customer)->first();
        $invoice = Invoices::where('id', $id)->where('is_deleted', 0)->first();
            // Simpan ke database
            $invoice->sales_id       = $sales;
            $invoice->jatuh_tempo    = $jatuh_tempo;
            $invoice->tanggal_nota   = $tanggal_nota;
            $invoice->grand_total    = $grand_total;
            $invoice->catatan        = $catatan;
            $invoice->updated_by        = Auth::user()->id;
            $invoice->save();
            

            // Admin Acitvity
            UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      =>Auth::user()->username ,
                "description"   => "Update Data invoice " . $customerName->nama. " ".$nomor_invoice,
                "activity_type" => UserActivity::UPDATE,
                "created_by"    => Auth::user()->id,
            ]);

            $this->code = 0;
            $this->message = "Update Invoices Success";
        }catch(Exception $e){
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function deleteInvoices(Request $request){
        $itemId     = $request->input('item_id');

        $validator = Validator::make($request->all(), [
            'item_id'       => 'required|string|min:36|max:36',
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            $itemInfo = Invoices::where('id', $itemId)->where('is_deleted', 0)->first();
            if (!$itemInfo){
                $this->code = 104;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $updateData = [
                'is_deleted'    => 1,
                'deleted_by'    => Auth::user()->id,
                'deleted_at'    =>  Carbon::now()
            ];

            $itemInfo->update($updateData);
            $itemInfo->save();

            // Admin Acitvity
            UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => Auth::user()->username,
                "description"   => "Delete Data Invoice " . $itemInfo->nomor_invoice ." nama cust. ".$itemInfo->customer->nama,
                "activity_type" => UserActivity::DELETE,
                "created_by"    => Auth::user()->username,
            ]);

            $this->code = 0;
            $this->message = "Delete Data invoice Success";
        }catch(Exception $e){
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }
    // End API Section
}
