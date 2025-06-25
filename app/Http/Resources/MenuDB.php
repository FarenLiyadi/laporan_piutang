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
    const CUSTOMERS_AR                   = '091';
    const BANK_AR                   = '092';
    const SALES_AR                   = '093';
    const REPORT_FINANCE_AR         = '133';
    
}
