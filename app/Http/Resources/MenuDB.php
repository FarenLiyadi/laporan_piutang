<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuDB extends JsonResource
{

    // Access Right (AR) Constants
    const DASHBOARD_AR              = '001';
    const USER_AR                   = '010';
    const ACCESS_RIGHT_AR           = '011';
    const USER_ACTIVITY_AR          = '012';
    const BANK_AR                   = '092';
    const REPORT_FINANCE_AR         = '133';
    
}
