<?php

namespace App\Models;

use App\Models\AccessRightDetail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AccessRight extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'access_right';

    protected $fillable = [
        'id',
        'access_name',
        // 'for_regist',
        'is_deleted',
        'created_by',
        'updated_by',
        'deleted_by',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    public function detail(){
        return $this->hasMany(AccessRightDetail::class, 'access_id', 'id');
    }

    public static function getAccessRights($accessId)
    {
        $cacheKey = "access_rights:{$accessId}";

        // Try to get the data from the cache
        $accessRights = Cache::get($cacheKey);

        // If cache does not exist, fetch from database and cache it
        if (!$accessRights) {
            $accessRights = self::select(['id', 'access_name'])
                ->where('id', $accessId)
                ->first();

            if ($accessRights) {
                $accessDetail = AccessRightDetail::select(['access_code', 'c', 'r', 'u', 'd'])
                    ->where('access_id', $accessRights->id)
                    ->get();

                $accessRights = [
                    'access' => $accessRights->toArray(),
                    'details' => $accessDetail->toArray()
                ];

                // Cache the data
                Cache::put($cacheKey, $accessRights, now()->addMinutes(10)); // Cache for 10 minutes
            }
        }

        return $accessRights;
    }
}
