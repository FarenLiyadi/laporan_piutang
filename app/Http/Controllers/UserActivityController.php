<?php

namespace App\Http\Controllers;

use Exception;
use Inertia\Inertia;
use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserActivityController extends Controller
{
    // View Section
    public function listUserActivityView(){
        return Inertia::render('UserActivity/list-user-activity', [
        ]);
    }
    // End View Section

    // API Section  
    public function listUserActivity(Request $request){
        $length     = $request->input('length', 10);
        $page       = $request->input('page', 1);
        $start_date = $request->input('start_date', '');
        $end_date   = $request->input('end_date', '');
        $username   = $request->input('username', '');

        $validator = Validator::make($request->all(), [
            'length'    => 'required|integer|min:1|max:100',
            'page'      => 'required|integer|min:1',
            'start_date' => 'nullable|date',
            'end_date'   => 'nullable|date',
            'username'   => 'nullable|string',
        ]);

        try {
            if ($validator->fails()) {
                $this->code = 1;
                throw new Exception($validator->errors()->first());
            }

            $offset     = $length * ($page - 1);
            $itemInfo   = UserActivity::query();
            
            if($username) { $itemInfo->where('username', 'LIKE', "$username%");}
            if($start_date) { $itemInfo->where('created_at', '>=', $start_date);}
            if($end_date) {$itemInfo->where('created_at', '<=', $end_date);}

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
    // End APi Section
}
