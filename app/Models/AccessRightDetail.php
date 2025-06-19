<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessRightDetail extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'access_right_detail';

    protected $fillable = [
        'id',
        'access_id',
        'access_code',
        'c',
        'r',
        'u',
        'd',
        'created_by',
        'updated_by',
        'deleted_by',
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
