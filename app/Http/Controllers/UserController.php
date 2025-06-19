<?php

namespace App\Http\Controllers;

use App\Models\AccessRight;
use App\Models\User;
use App\Models\UserActivity;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;

class UserController extends Controller
{
    public function changePasswordView(){
        return Inertia::render('User/change-password', [
        ]);
    }

    public function listUserView(){
        return Inertia::render('User/list-user', [
        ]);
    }

    public function createUserView(){
        return Inertia::render('User/create-user', [
        ]);
    }

    public function detailUserView(){
        return Inertia::render('User/detail-user', [
        ]);
    }

    public function updateUserView(){
        return Inertia::render('User/update-user', [
        ]);
    }


    // api section
    public function changePassword(Request $request){
        $actorId        = $request->input('actor_id');
        $old_password   = $request->input('old_password');
        $password       = $request->input('password');
        $confPass       = $request->input('conf_password');

        $validator = Validator::make($request->all(), [
            'actor_id'      => 'required|string|min:36|max:36',
            'old_password'  => 'required|string|min:8|max:20',
            'password'      => 'required|string|min:8|max:20',
            'conf_password' => 'required|string|min:8|max:20',
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            $itemInfo = User::where('id', $actorId)->where('is_deleted', 0)->first();
            if (!$itemInfo){
                $this->code = 104;
                throw new Exception($this->getErrorMessage($this->code));
            }

            // verify Old Password
            if (!Hash::check($old_password, $itemInfo->password)) {
                $this->code = 112; 
                throw new Exception($this->getErrorMessage($this->code));
            }

            if ($old_password === $password) {
                $this->code = 101;
                throw new Exception($this->getErrorMessage($this->code));
            }
            
            if($password != $confPass){
                $this->code = 106;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $updateData = [
                'password'      => Hash::make($password),
                'updated_by'    => $actorId,
                'updated_at'    =>  Carbon::now(),
            ];

            $oldData =  $itemInfo->toArray();
            $itemInfo->update($updateData);
            $itemInfo->save();

            // User Activity
            // UserActivity::create([
            //     "id"            => Uuid::uuid1(),
            //     "username"      => $itemInfo->username,
            //     "description"   => "Self Change Password ". $itemInfo->username,
            //     "activity_type" => (int) UserActivity::UPDATE,
            //     "old_data"      => $oldData,
            //     "new_data"      => $itemInfo->toArray(),
            //     "created_by"    => $actorId,
            // ]);

            $this->code = 0;
            $this->message = "Change Password Success";
        }catch(Exception $e){
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function listUser(Request $request){
        $length     = $request->input('length', 10);
        $page       = $request->input('page', 1);
        $username   = $request->input('username');
        $roles      = $request->input('roles');

        $validator = Validator::make($request->all(), [
            'length'    => 'required|integer|min:1|max:100',
            'page'      => 'required|integer|min:1',
            'username'  => 'nullable|string|',
            'roles'     => 'nullable|string',
        ]);

        try {
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            $offset     = $length * ($page - 1);
            $itemInfo   = User::query()->where('is_deleted', 0);

            if ($username) { $itemInfo->where('username', 'LIKE', "$username%"); }
            
            switch (intval($roles)) {
                case 1:
                    $itemInfo->where('roles', 1);
                    break;
                case 2:
                    $itemInfo->where('roles', 2);
                    break;
                case 3:
                    $itemInfo->where('roles', 3);
                    break;
                case 4:
                    $itemInfo->where('roles', 4);
                    break;
                case 5:
                    $itemInfo->where('roles', 5);
                    break;
                default:
                    break;
            }

            $response = [
                "total" => $itemInfo->count(),
                "item"  => $itemInfo->orderByDesc('created_at')->skip($offset)->take($length)->get(),
            ];

            $this->dataMsg  = $response;
            $this->code     = 0;
        } catch (Exception $e) {
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function createUser(Request $request){
        $actorId    = $request->input('actor_id');
        $username   = $request->input('username');
        $access_id  = $request->input('access_id');
        $password   = $request->input('password');
        $confPass   = $request->input('conf_password');
        $email      = $request->input('email');
        $nomor_hp   = $request->input('nomor_hp');

        $validator = Validator::make($request->all(), [
            'actor_id'      => 'required|string|min:36|max:36',
            'username'      => 'required|string|min:5|max:20',
            'access_id'     => 'required|string|min:36|max:36',
            'password'      => 'required|string|min:8|max:20',
            'conf_password' => 'required|string|min:8|max:20',
            'email'         => 'nullable|string|email',
            'nomor_hp'      => 'nullable|string',
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            if($password != $confPass){
                $this->code = 106;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $adminInfo = User::where('id', $actorId)->where('is_deleted', 0)->first();

            $userInfo =  User::where('username', $username)->where('is_deleted', 0)->first();
            if ($userInfo){
                $this->code = 102;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $accessRight = AccessRight::where('id', $access_id)->where('is_deleted', 0)->first();
            if (!$accessRight){
                $this->code = 202;
                throw new Exception($this->getErrorMessage($this->code));
            }


            $Userid = Uuid::uuid1();
            User::create([
                "id"            => $Userid,
                "username"      => $username,
                "access_id"     => $accessRight->id,
                "email"         => $email,
                "phone_number"  => $nomor_hp,
                "password"      => Hash::make($password),
                "created_by"    => $actorId,
            ]);

          

            // User Activity
            UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => $adminInfo['username'],
                "description"   => "Create New User with username ".$username,
                "activity_type" => (int) 1,
                "created_by"    => $actorId,
            ]);

            $this->code = 0;
            $this->message = "Add New User Success";
        }catch(Exception $e){
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function detailUser(Request $request){
        $itemId   = $request->input('item_id');

        $validator = Validator::make($request->all(), [
            'item_id' => 'required|string|min:36|max:36',
        ]);

        try {
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
            $itemInfo = User::with(['updatedByUser', 'createdByUser'])->where('id', $itemId)->where('is_deleted', 0)->first();

            if (!$itemInfo){
                $this->code = 201;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $tmp = [
                'item' => []
            ];

            $tmp['item'][0] = $itemInfo['id'];
            $tmp['item'][1] = $itemInfo['username'];
            $tmp['item'][2] = $itemInfo['access_id'];
     
            $tmp['item'][5] = $itemInfo['created_at'];
            $tmp['item'][6] = $itemInfo['updated_at'];
            $tmp['item'][7] = $itemInfo->updatedByUser ? $itemInfo->updatedByUser->username : 'System';
            $tmp['item'][8] = $itemInfo->createdByUser ? $itemInfo->createdByUser->username : 'System';
           
            $tmp['item'][10] = $itemInfo['email'];
            $tmp['item'][11] = $itemInfo['is_enabled'];
            $tmp['item'][12] = $itemInfo['phone_number'];

            $this->dataMsg  = $tmp;
            $this->code     = 0;
        } catch (Exception $e) {
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function updateUser(Request $request){
        $actorId    = $request->input('actor_id');
        $itemId     = $request->input('item_id');
        $username   = $request->input('username');
        $access_id  = $request->input('access_id');
        $password   = $request->input('password');
        $confPass   = $request->input('conf_password');
        $is_enabled      = $request->input('is_enabled');
        $email      = $request->input('email');
        $nomor_hp   = $request->input('nomor_hp');

        $validator = Validator::make($request->all(), [
            'actor_id'      => 'required|string|min:36|max:36',
            'item_id'       => 'required|string|min:36|max:36',
            'username'      => 'nullable|string|min:5|max:20',
            'access_id'     => 'required|string|min:36|max:36',
            'password'      => 'nullable|string|min:8|max:20',
            'conf_password' => 'nullable|string|min:8|max:20',
            'is_enabled'         => 'required|in:0,1',
            'email'         => 'nullable|string|email',
            'nomor_hp'      => 'nullable|string',
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            $userInfo = User::where('id', $actorId)->first();

            $itemInfo = User::where('id', $itemId)->where('is_deleted', 0)->first();
            if (!$itemInfo){
                $this->code = 104;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $accessRight = AccessRight::where('id', $access_id)->where('is_deleted', 0)->first();
            if (!$accessRight){
                $this->code = 202;
                throw new Exception($this->getErrorMessage($this->code));
            }

           
            $updateData = [
                'username'      => $username,
                'is_enabled'    => $is_enabled ,
                'email'         => $email,
                'phone_number'  => $nomor_hp,
                'access_id'     => $accessRight->id,
                'updated_by'    => $actorId,
                'updated_at'    =>  Carbon::now(),
            ];

            if ($password) { 
                if($password != $confPass){
                    $this->code = 106;
                    throw new Exception($this->getErrorMessage($this->code));
                }
                $updateData['password'] = Hash::make($password);
            }

            $oldData =  $itemInfo->toArray();
            $itemInfo->update($updateData);
            $itemInfo->save();

            // User Activity
            UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => $userInfo->username,
                "description"   => "Update User ". $itemInfo->username,
                "activity_type" => (int) 2,
                "old_data"      => $oldData,
                "new_data"      => $itemInfo->toArray(),
                "created_by"    => $actorId,
            ]);

            $this->code = 0;
            $this->message = "Update User Success";
        }catch(Exception $e){
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function deleteUser(Request $request){
        $actorId    = $request->input('actor_id');
        $itemId     = $request->input('item_id');

        $validator = Validator::make($request->all(), [
            'actor_id'      => 'required|string|min:36|max:36',
            'item_id'       => 'required|string|min:36|max:36',
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            $userInfo = User::where('id', $actorId)->first();

            $itemInfo = User::where('id', $itemId)->where('is_deleted', 0)->first();
            if (!$itemInfo){
                $this->code = 104;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $updateData = [
                'is_deleted'    => 1,
                'deleted_by'    => $actorId,
                'deleted_at'    =>  Carbon::now()
            ];

            $oldData =  $itemInfo->toArray();
            $itemInfo->update($updateData);
            // Log::debug($itemInfo);
            $itemInfo->save();

            // User Acitvity
            UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => $userInfo->username,
                "description"   => "Delete User ". $itemInfo->username,
                "activity_type" => (int) 3,
                "old_data"      => $oldData,
                "new_data"      => $itemInfo->toArray(),
                "created_by"    => $actorId,
            ]);

            $this->code = 0;
            $this->message = "Delete User Success";
        }catch(Exception $e){
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }
}
