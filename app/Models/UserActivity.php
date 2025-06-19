<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class UserActivity extends Model
{
    use HasFactory;

    // Create 1
    // Update 2
    // Delete 3
    // Other 4
    const CREATE = 1;
    const UPDATE = 2;
    const DELETE = 3;
    const OTHER = 4;

    protected $fillable = [
        'id',
        'username',
        'description',
        'activity_type',
        'old_data',
        'new_data',
        'created_by',
        'created_at',
    ];

    // Untuk JSON
    protected function oldData(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true),
            set: fn ($value) => json_encode($value),
        );
    }

    protected function newData(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => json_decode($value, true),
            set: fn ($value) => json_encode($value),
        );
    }
}
