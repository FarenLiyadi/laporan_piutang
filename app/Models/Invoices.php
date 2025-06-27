<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoices extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = [
        'id',
        'customer_id',
        'sales_id',
        'tanggal_nota',
        'nomor_invoice',
        'grand_total',
        'jatuh_tempo',
        'catatan',
        'total_bayar',
        'is_deleted',
        'created_at',
        'created_by',
        'updated_by',
        'deleted_by',
        'deleted_at',
    ];

     // Relasi ke Customer
     public function customer()
     {
         return $this->belongsTo(Customer::class);
     }
 
     // Relasi ke Sales
     public function sales()
     {
         return $this->belongsTo(Sales::class);
     }
     public function updatedByUser()
     {
         return $this->belongsTo(User::class, 'updated_by');
     }
 
     public function createdByUser()
     {
         return $this->belongsTo(User::class, 'created_by');
     }
     public function pembayaran()
    {
        return $this->hasMany(Pembayaran::class, 'invoice_id', 'id');
    }
}
