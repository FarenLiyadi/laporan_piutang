<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RolesDB extends JsonResource
{

    // Access Right (AR) Constants
    const OWNER_AR        = 1;
    const LEADER_AR       = 2;
    const ADMIN_AR        = 3;
    const CLIENT_AR       = 4;
    const PAGAR_AYU_AR    = 5;
}
