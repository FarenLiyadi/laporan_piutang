<?php

use App\Http\Controllers\AccessRightController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Resources\MenuDB;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

   

    Route::prefix('/admin')->group(function () {
        Route::controller(AccessRightController::class)->group(function () {
            Route::get('/list-access-right', 'listAccessRightView')->name('list.access-right.view')->middleware('access.check:'. MenuDB::ACCESS_RIGHT_AR .',r');
            Route::get('/list-access-right-request', 'listAccessRight')->name('list.access-right')->middleware('access.check:'. MenuDB::ACCESS_RIGHT_AR .',r');
            
            Route::get('/detail-access-right', 'detailAccessRightView')->name('detail.access-right.view')->middleware('access.check:'. MenuDB::ACCESS_RIGHT_AR .',r');
            Route::get('/detail-access-right-request', 'detailAccessRight')->name('detail.access-right')->middleware('access.check:'. MenuDB::ACCESS_RIGHT_AR .',r');
            
            Route::get('/update-access-right', 'updateAccessRightView')->name('update.access-right.view')->middleware('access.check:'. MenuDB::ACCESS_RIGHT_AR .',u');
            Route::post('/update-access-right', 'updateAccessRight')->name('update.access-right')->middleware('access.check:'. MenuDB::ACCESS_RIGHT_AR .',u');
            
            Route::post('/delete-access-right', 'deleteAccessRight')->name('delete.access-right')->middleware('access.check:'. MenuDB::ACCESS_RIGHT_AR .',d');
            
            Route::get('/create-access-right', 'createAccessRightView')->name('create.access-right.view')->middleware('access.check:'. MenuDB::ACCESS_RIGHT_AR .',c');
            Route::post('/create-access-right', 'createAccessRight')->name('create.access-right')->middleware('access.check:'. MenuDB::ACCESS_RIGHT_AR .',c');
        });

         // change password
        Route::controller(UserController::class)->group(function () {
            Route::get('/change-password', 'changePasswordView')->name('change.password.view')->middleware('access.check');
            Route::post('/change-password-request', 'changePassword')->name('change.password')->middleware('access.check');   });
        
    });


    // untuk local storage
        Route::prefix('/x-resource')->group(function () {
            Route::controller(ResourceController::class)->group(function () {
                Route::get('/leader-list', 'listLeader')->name('list.leader');
                Route::get('/access-right', 'listAccessRight')->name('list.access-right');
                
                Route::get('/access-right-info', 'accessRight');
            });
        });

    //untuk access controller
        // Route::controller(AccessController::class)->group(function () {
        //     Route::get('/access-not-allowed', 'accessNotAllowed')->name('access.not.allowed');
        //     Route::get('/not-allowed', 'clientAccessNotAllowed')->name('client.access.not.allowed');
        // }); 

    // disabled
        // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
