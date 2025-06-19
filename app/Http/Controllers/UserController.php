<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserController extends Controller
{
    public function changePasswordView(){
        return Inertia::render('User/change-password', [
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
}
