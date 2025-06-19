<?php

namespace App\Http\Controllers;

use Exception;
use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use Ramsey\Uuid\Uuid;
use App\Models\AccessRight;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use App\Models\AccessRightDetail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Validator;

class AccessRightController extends Controller
{
    // View Section
    public function listAccessRightView(){
        return Inertia::render('AccessRight/list-access-right', [
        ]);
    }

    public function createAccessRightView(){
        return Inertia::render('AccessRight/create-access-right', [
        ]);
    }

    public function detailAccessRightView(){
        return Inertia::render('AccessRight/detail-access-right', [
        ]);
    }

    public function updateAccessRightView(){
        return Inertia::render('AccessRight/update-access-right', [
        ]);
    }
    // End View Section

    // API Section
    public function listAccessRight(Request $request){
        $length     = $request->input('length', 10);
        $page       = $request->input('page', 1);
        $accessName = $request->input('access_name');

        $validator = Validator::make($request->all(), [
            'length'        => 'required|integer|min:1|max:100',
            'page'          => 'required|integer|min:1',
            'access_name'   => 'nullable|string|',
        ]);

        try {
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            $offset     = $length * ($page - 1);
            $itemInfo   = AccessRight::query()->where('is_deleted', 0);

            if ($accessName) { $itemInfo->where('access_name', 'LIKE', "$accessName%"); }
            
            $response = [
                "total" => $itemInfo->count(),
                "item"  => $itemInfo->orderByDesc('created_at')->skip($offset)->take($length)->get(),   
            ];
            
            $tmp = [
                'total' => $response['total'],
                'item'  => []
            ];

            foreach ($response['item'] as $key => $item) {
                $tmp['item'][$key][0] = $item['id'];
                $tmp['item'][$key][1] = $item['access_name'];
                $tmp['item'][$key][2] = $item['created_at'];
                $tmp['item'][$key][3] = $item['for_regist'];
            }

            $this->dataMsg  = $tmp;
            $this->code     = 0;
        } catch (Exception $e) {
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function createAccessRight(Request $request){
        $actorId    = $request->input('actor_id');
        $name       = $request->input('name');
        $for_regist       = $request->input('for_regist');
        $accessArr  = $request->input('access');
        $decodeArr  = json_decode($accessArr, true);

        $validator = Validator::make($request->all(), [
            'actor_id'  => 'required|string|min:36|max:36',
            'name'      => 'required|string|',
            'access'    => 'required|string',
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            $adminInfo = User::where('id', $actorId)->where('is_deleted', 0)->first();

            $itemInfo = AccessRight::where('access_name', $name)->where('is_deleted', 0)->first();
            if ($itemInfo){
                $this->code = 102;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $AccessRightid = Uuid::uuid1();

            AccessRight::create([
                "id"            => $AccessRightid,
                "access_name"   => $name,
                "for_regist"   => $for_regist,
                "created_by"    => $actorId,
            ]);

            $detail = [];
            foreach($decodeArr as $r){
                $detail[] = [
                    "id"            => Uuid::uuid1(),
                    "access_id"     => $AccessRightid,
                    "access_code"   => $r['menu'],
                    "c"             => $r['c'],
                    "r"             => $r['r'],
                    "u"             => $r['u'],
                    "d"             => $r['d'],
                    "created_by"    => $actorId,
                ];
            }

            if( $detail ){ AccessRightDetail::insert( $detail ); }

            $newData = [
                "access_id"     => $AccessRightid, 
                "access_name"   => $name,
                "access_detail" => json_encode( $detail ),
                "created_by"    => $actorId,
                "created_at"    => round(microtime(true) * 1000),
            ];

            // User Activity
            UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => $adminInfo['username'],
                "description"   => "Create New Hak Akses",
                "activity_type" => UserActivity::CREATE,
                "new_data"      => json_encode($newData),
                "created_by"    => $actorId,
            ]);

            $this->code = 0;
            $this->message = "Add New Access Right Success";
        }catch(Exception $e){
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function detailAccessRight(Request $request){
        $itemId   = $request->input('item_id');

        $validator = Validator::make($request->all(), [
            'item_id' => 'required|string|min:36|max:36',
        ]);

        try {
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }
            $itemInfo = AccessRight::where('id', $itemId)->where('is_deleted', 0)->first();
            if (!$itemInfo){
                $this->code = 201;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $accessDetail = AccessRightDetail::where('access_id', $itemInfo->id)->get();
            $itemInfo['detail'] = $accessDetail;

            $tmp = [];
            $tmp['0'] = $itemInfo['id'];
            $tmp['1'] = $itemInfo['access_name'];
            $tmp['2'] = $itemInfo['for_regist'];
            $tmp['3'] = $itemInfo['detail'];

            $this->dataMsg  = $tmp;
            $this->code     = 0;
        } catch (Exception $e) {
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function updateAccessRight(Request $request){
        $actorId    = $request->input('actor_id');
        $itemId     = $request->input('item_id');
        $name       = $request->input('name');
        $for_regist       = $request->input('for_regist');
        $accessArr  = $request->input('access');
        $decodeArr  = json_decode($accessArr, true);

        $validator = Validator::make($request->all(), [
            'actor_id'  => 'required|string|min:36|max:36',
            'item_id'   => 'required|string|min:36|max:36',
            'name'      => 'required|string|',
            'access'    => 'required|string',
        ]);

        try{
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            $updateData = [
                "access_name"   => $name,
                "for_regist"   => $for_regist,
                'updated_by'    => $actorId,
                'updated_at'    => Carbon::now()
            ];

            $userInfo = User::where('id', $actorId)->first();

            $itemInfo = AccessRight::where('id', $itemId)->where('is_deleted', 0)->first();
            if (!$itemInfo){
                $this->code = 104;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $oldDataDetail = [];
            $newDataDetail = [];
            if( $decodeArr ){ // have change in access right
                $detailItem = AccessRightDetail::where('access_id', $itemId)->get();
                foreach($decodeArr as $r){
                    $idxAccess = array_search($r['menu'], array_column($detailItem->toArray(), 'access_code'));
                    $selected  = $detailItem[$idxAccess];

                    if ( !$detailItem->contains('access_code', $r['menu']) ){
                        $selected = new AccessRightDetail();
                    }

                    $temp = [
                        "access_code"   => $r['menu'],
                        "c"             => $selected->c ?? null,
                        "r"             => $selected->r ?? null,
                        "u"             => $selected->u ?? null,
                        "d"             => $selected->d ?? null,
                    ];

                    $selected->c  = $r['c'];
                    $selected->r  = $r['r'];
                    $selected->u  = $r['u'];
                    $selected->d  = $r['d'];

                    if( $selected->created_at ){ // Update
                        $selected->updated_by = $actorId;
                        $selected->updated_at = Carbon::now();
                    }else{ // Insert
                        $selected->id = Uuid::uuid1();
                        $selected->access_id  = $itemId;
                        $selected->access_code= $r['menu'];
                        $selected->created_by = $actorId;
                    }

                    $oldDataDetail[] = ['id' => $selected->id] + $temp;

                    $newDataDetail[] = [
                        "id"            => $selected->id,
                        "access_code"   => $r['menu'],
                        "c"             => $r['c'],
                        "r"             => $r['r'],
                        "u"             => $r['u'],
                        "d"             => $r['d'],
                    ];

                    $selected->save();
                }
            }

            $oldData = $itemInfo->toArray();
            $oldData['detail'] = $oldDataDetail;

            $itemInfo->update($updateData);
            $itemInfo->save();
            $newData = $itemInfo->toArray();
            $newData['detail'] = $newDataDetail;

            Cache::forget('access_rights:'.$itemInfo->id);

            // User Activity
            UserActivity::create([
                "id"            => Uuid::uuid1(),
                "username"      => $userInfo->username,
                "description"   => "Update Access Right ". $itemInfo->access_name,
                "activity_type" => UserActivity::UPDATE,
                'old_data'      => json_encode($oldData),
                'new_data'      => json_encode($newData),
                "created_by"    => $actorId,
            ]);

            $this->code = 0;
            $this->message = "Update Access Right Success";
        }catch(Exception $e){
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }

    public function deleteAccessRight(Request $request){
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

            $itemInfo = AccessRight::where('id', $itemId)->where('is_deleted', 0)->first();
            if (!$itemInfo){
                $this->code = 104;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $data = User::where('access_id', $itemInfo->id)->where('is_deleted', 0)->first();
            if ($data){
                $this->code = 204;
                throw new Exception($this->getErrorMessage($this->code));
            }

            $userInfo = User::where('id', $actorId)->first();

            $updateData = [
                'is_deleted'    => 1,
                'deleted_by'    => $actorId,
                'deleted_at'    =>  Carbon::now()
            ];

            $oldData = $itemInfo->toArray();
            $itemInfo->update($updateData);
            $itemInfo->save();

            //  Acitvity
            // UserActivity::create([
            //     "id"            => Uuid::uuid1(),
            //     "username"      => $userInfo->username,
            //     "description"   => "Delete Access Right ". $itemInfo->access_name,
            //     "activity_type" => (int) 3,
            //     "old_data"      => $oldData,
            //     "new_data"      => $itemInfo->toArray(),
            //     "created_by"    => $actorId,
            // ]);

            $this->code = 0;
            $this->message = "Delete Access Right Success";
        }catch(Exception $e){
            $this->message = $e->getMessage();
        }

        return $this->createResponse($this->dataMsg, $this->code, $this->message);
    }
    // End APi Section
}
