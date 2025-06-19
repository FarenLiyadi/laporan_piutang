<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use App\Models\AccessRight;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class AccessCheck
{
    public function handle(Request $request, Closure $next, $menu_code = '', $action = ''): Response
    {
        $response   = '';
        $errorMsg   = new Controller();
        $code       = 9;

        try{
            $user = Auth::user();
            // Log::info($user);
            $accessRights = AccessRight::getAccessRights($user->access_id);

            // Check Admin Info Exist
            if( !$user ){
                $code = 109;
                throw new Exception($errorMsg->getErrorMessage($code));
            }
    
            // Skip hak akses
            if( $menu_code == ''){
                goto ending_phase;
            }
    
            // Check Access
            $arrAccess  = array_column( $accessRights['details'], 'access_code');
            $accessOk   = array_search( $menu_code, $arrAccess);
            
            if( $accessOk !== FALSE ){
                if($accessRights['details'][$accessOk][$action] == 0){
                    $code = 113;
                    throw new Exception($errorMsg->getErrorMessage($code));
                }
            }else{
                $code = 113;
                throw new Exception($errorMsg->getErrorMessage($code));
            }

            ending_phase:
            $response = $next($request);
        }catch(Exception $e){
            $user = Auth::user();
            if($request->ajax()){
                $response = $errorMsg->createResponse('', $code, $e->getMessage());
            } else {
                if ($user->roles == 4) {
                    $response = Redirect::route('client.access.not.allowed');
                } else {
                    $response = Redirect::route('access.not.allowed');
                }
            }
        }

        return $response;
    }
}
