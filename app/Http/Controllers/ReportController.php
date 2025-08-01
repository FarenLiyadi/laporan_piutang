<?php

namespace App\Http\Controllers;

use App\Models\AkunBank;
use App\Models\Customer;
use App\Models\Invoices;
use App\Models\Pembayaran;
use App\Models\Sales;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function reportPiutangBeredarView(){
        
        return Inertia::render('Report/list-user-report-piutang-beredar', [
            
        ]);
    }
    public function reportPiutangBeredarUserView(){
        $sales = Sales::
            where('is_deleted', 0)->where('is_enabled',1)
            ->get()
            ->map(function ($cust) {
                return [
                    'value' => $cust->id,
                    'label' => $cust->nama . ' (' . $cust->no_hp . ')',
                ];
            });
        return Inertia::render('Report/report-piutang-beredar', [
            'salesList' => $sales,
        ]);
    }
    public function reportPiutangBeredar(Request $request)
    {
        
        $userId  = $request->input('user_id');
        $salesman  = $request->input('sales');
        $jatuh_tempo  = $request->input('jatuh_tempo');
        $sort  = $request->input('sort');
     

        $validator = Validator::make($request->all(), [
           
            'userId' => 'nullable|string',
            'jatuh_tempo' => 'nullable|in:0,1,2',
            'sort' => 'nullable|in:0,1,2',
        ]);
    
        try {
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
        
            $query = Invoices::with([
                'customer',
                'sales',
            ])
            ->where('invoices.is_deleted', 0)
            ->join('customers', 'customers.id', '=', 'invoices.customer_id')
            ->orderBy('customers.nama', 'asc')
            ->select('invoices.*'); // Pastikan hanya select kolom dari invoices agar tetap return model Invoice
        $custName="";
            // Filter by customer_id
            if (!empty($userId)) {
                $query->where('customer_id', $userId);
                $custQuery = Customer::where('id',$userId)->first();
                $custName = $custQuery?->nama??'';
            }


            if (!empty($salesman)) {
                $query->where('sales_id', $salesman);
            }
        
            // Filter by jatuh_tempo
            if ($jatuh_tempo == 1) {
                $query->where('jatuh_tempo', '<', Carbon::today());
            }

            if ($jatuh_tempo == 0) {
                $sixMonthsAgo = Carbon::today()->subMonths(6);
                $query->where('jatuh_tempo', '<', $sixMonthsAgo);
            }
        
            $items = $query->get()
            ->map(function ($invoice) {
                $invoice->sisa = $invoice->grand_total - $invoice->total_bayar;
                return $invoice;
            })
            ->filter(function ($invoice) {
                return $invoice->sisa > 0;
            });
        
        if ($sort == 1) {
            // Sort dari sisa terbesar ke terkecil
            $items = $items->sortByDesc('sisa')->values();
        } elseif ($sort == 2) {
            // Sort dari sisa terkecil ke terbesar
            $items = $items->sortBy('sisa')->values();
        } else {
            // Tanpa sort khusus, hanya reset index
            $items = $items->values();
        }
        
            // Hitung total invoice
            $total_invoice = $items->count();
        
            // Hitung total customer unik
            $total_customer = $items->pluck('customer.id')->unique()->count();
        
            // Hitung total piutang
            $total_piutang = $items->sum('sisa');
        
            $this->dataMsg = [
                'item'            => $items,
                'total_invoice'   => $total_invoice,
                'total_customer'  => $total_customer,
                'total_piutang'   => $total_piutang,
                'custName' => $custName,
            ];
            $this->code = 0;
        } catch (Exception $e) {
            $this->message = $e->getMessage();
        }
    
        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function reportPembayaranView(){
        return Inertia::render('Report/list-user-report-pembayaran', [
        ]);
    }

    public function reportPembayaranUserView(){
        $bank = AkunBank::where('is_deleted',0)->get();
        return Inertia::render('Report/report-pembayaran', [
            'bank' => $bank,
        ]);
    }

    public function reportPembayaran(Request $request)
    {
        
        $userId  = $request->input('user_id');
        $bankId  = $request->input('idBank');
        $startDate  = $request->input('startDate');
        $endDate  = $request->input('endDate');
        $jatuh_tempo  = $request->input('jatuh_tempo');
     

        $validator = Validator::make($request->all(), [
           
            'userId' => 'nullable|string',
            'jatuh_tempo' => 'nullable|in:0,1,2',
            'startDate' => 'nullable|date',
            'endDate' => 'nullable|date',
            'idBank' => 'nullable|integer',
        ]);
    
        try {
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
        
            $query = Pembayaran::with([
                'invoice.customer',
                'invoice.sales',
                'bank',
            ])->where('pembayarans.is_deleted', 0);
            
            // Filter customer
            $custName = '';
            if (!empty($userId)) {
                $query->whereHas('invoice', function ($q) use ($userId) {
                    $q->where('customer_id', $userId);
                });
            
                $custQuery = Customer::find($userId);
                $custName = $custQuery?->nama ?? '';
            }
            
            // Filter bank_id
            if (!empty($bankId)) {
                $query->where('akun_bank_id', $bankId);
            }
           
            if ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            }
    
            if ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            }
            
            // Ambil data
            $items = $query->get();
            
            // Filter jatuh tempo
            if ($jatuh_tempo == 0) {
                $items = $items->filter(function ($pembayaran) {
                    return optional($pembayaran->invoice)->jatuh_tempo < $pembayaran->created_at;
                })->values();
            } elseif ($jatuh_tempo == 1) {
                $items = $items->filter(function ($pembayaran) {
                    return optional($pembayaran->invoice)->jatuh_tempo > $pembayaran->created_at;
                })->values();
            }
            
            // Hitung total
            $total_bayar = $items->sum('nominal');
            $total_invoice = $items->pluck('invoice.id')->unique()->count();
            $total_customer = $items->pluck('invoice.customer.id')->unique()->count();
        
            $this->dataMsg = [
                'item'            => $items,
                'total_invoice'   => $total_invoice,
                'total_customer'  => $total_customer,
                'total_bayar'   => $total_bayar,
                'custName' => $custName,
            ];
            $this->code = 0;
        } catch (Exception $e) {
            $this->message = $e->getMessage();
        }
    
        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }
   
}
