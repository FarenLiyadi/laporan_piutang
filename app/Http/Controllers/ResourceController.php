<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use App\Models\AccessRight;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\AccessRightResource;
use Illuminate\Support\Facades\Log;

class ResourceController extends Controller
{
    public function listLeader(){
        try {
            $itemInfo   = User::where('roles', 2)->where('is_deleted', 0)->orderByDesc('created_at')->get();

            // Log::info('hello');
            $this->dataMsg  = new UserResource($itemInfo);
            $this->code     = 0;            
        } catch (Exception $e) {
            $this->message = $e->getMessage();
        }
        
        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function listAccessRight(){
        try {
            $itemInfo   = AccessRight::where('is_deleted', 0)->orderByDesc('created_at')->get();

            $this->dataMsg  = new AccessRightResource($itemInfo);
            $this->code     = 0;            
        } catch (Exception $e) {
            $this->message = $e->getMessage();
        }
        
        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function accessRight(){
        try {
            $user = Auth::user();
            $accessRights = AccessRight::getAccessRights($user->access_id);

            $this->dataMsg  = $accessRights;
            $this->code     = 0;            
        } catch (Exception $e) {
            $this->message = $e->getMessage();
        }
        
        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }
}
