<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = [
        'id',
        'invoice_id',
        'akun_bank_id',
        'tanggal_nota',
        'nominal',
        'catatan',
        'is_deleted',
        'created_at',
        'created_by',
        'updated_by',
        'deleted_by',
        'deleted_at',
    ];
    public function bank()
{
    return $this->belongsTo(AkunBank::class, 'akun_bank_id');
}
}
