<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory, HasUuids;
    protected $fillable = [
        'id',
        'nama',
        'alamat',
        'no_hp',
        'is_enabled',
        'document',
        'is_deleted',
        'created_by',
        'updated_by',
        'deleted_by',
        'deleted_at',
    ];


  
}
