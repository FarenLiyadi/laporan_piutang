<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class AccessController extends Controller
{
    public function accessNotAllowed(){
        return Inertia::render('Error/access-not-allowed');
    }

    public function clientAccessNotAllowed(){
        return Inertia::render('Error/client-access-not-allowed');
    }
}
