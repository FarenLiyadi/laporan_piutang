<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AkunBank extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'nama_bank',
        'is_deleted',
 
    ];

    // public function penjualan()
    // {
    //     return $this->belongsTo(Penjualan::class);
    // }
    // public function pengeluaran()
    // {
    //     return $this->hasMany(pengeluarans::class);
    // }
}
