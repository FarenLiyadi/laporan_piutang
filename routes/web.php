<?php

use App\Http\Controllers\AccessController;
use App\Http\Controllers\AccessRightController;
use App\Http\Controllers\AkunBankController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\InvoicesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\UserActivityController;
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
    })->middleware('access.check:'. MenuDB::DASHBOARD_AR .',r')->name('dashboard');
   

   

    Route::prefix('/admin')->group(function () {

        Route::controller(AkunBankController::class)->group(function () {
            Route::get('/list-bank', 'index')->name('list.bank.view')->middleware('access.check:'. MenuDB::BANK_AR .',r');
            Route::get('/list-bank-request', 'listBank')->middleware('access.check:'. MenuDB::BANK_AR .',r');
            Route::post('/create-bank','store')->middleware('access.check:'. MenuDB::BANK_AR .',c');
            Route::post('/delete-bank','destroy')->middleware('access.check:'. MenuDB::BANK_AR .',d');
        });

        Route::controller(CustomersController::class)->group(function () {
            Route::get('/list-customers', 'index')->name('list.customers.view')->middleware('access.check:'. MenuDB::CUSTOMERS_AR .',r');
            Route::get('/download-file-customers/{id}','accessFile')->middleware('access.check:'. MenuDB::CUSTOMERS_AR .',r');
            Route::get('/list-customers-request', 'listCustomers')->middleware('access.check:'. MenuDB::CUSTOMERS_AR .',r');
            Route::post('/create-customers','store')->middleware('access.check:'. MenuDB::CUSTOMERS_AR .',c');
            Route::post('/update-customers','update')->middleware('access.check:'. MenuDB::CUSTOMERS_AR .',u');
            Route::post('/delete-customers','destroy')->middleware('access.check:'. MenuDB::CUSTOMERS_AR .',d');
        });
        Route::controller(SalesController::class)->group(function () {
            Route::get('/list-sales', 'index')->name('list.sales.view')->middleware('access.check:'. MenuDB::SALES_AR .',r');
            Route::get('/download-file-sales/{id}','accessFile')->middleware('access.check:'. MenuDB::SALES_AR .',r');
            Route::get('/list-sales-request', 'listsales')->middleware('access.check:'. MenuDB::SALES_AR .',r');
            Route::post('/create-sales','store')->middleware('access.check:'. MenuDB::SALES_AR .',c');
            Route::post('/update-sales','update')->middleware('access.check:'. MenuDB::SALES_AR .',u');
            Route::post('/delete-sales','destroy')->middleware('access.check:'. MenuDB::SALES_AR .',d');
        });

        Route::controller(InvoicesController::class)->group(function () {
            Route::get('/list-invoices', 'listInvoicesView')->name('list.invoices.view')->middleware('access.check:'. MenuDB::INVOICES_AR .',r');
            Route::get('/list-invoices-request', 'listInvoices')->name('list.invoices')->middleware('access.check:'. MenuDB::INVOICES_AR .',r');
        
            Route::get('/detail-invoices', 'detailInvoicesView')->name('detail.invoices.view')->middleware('access.check:'. MenuDB::INVOICES_AR .',r');
            Route::get('/detail-invoices-request', 'detailInvoices')->name('detail.invoices')->middleware('access.check:'. MenuDB::INVOICES_AR .',r');
        
            Route::get('/update-invoices', 'updateInvoicesView')->name('update.invoices.view')->middleware('access.check:'. MenuDB::INVOICES_AR .',u');
            Route::post('/update-invoices', 'updateInvoices')->name('update.invoices')->middleware('access.check:'. MenuDB::INVOICES_AR .',u');
        
            Route::post('/delete-invoices', 'deleteInvoices')->name('delete.invoices')->middleware('access.check:'. MenuDB::INVOICES_AR .',d');
        
            Route::get('/create-invoices', 'createInvoicesView')->name('create.invoices.view')->middleware('access.check:'. MenuDB::INVOICES_AR .',c');
            Route::post('/create-invoices', 'createInvoices')->name('create.invoices')->middleware('access.check:'. MenuDB::INVOICES_AR .',c');
        });

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
            Route::post('/change-password-request', 'changePassword')->name('change.password')->middleware('access.check');   
        
            Route::get('/list-user', 'listUserView')->name('list.user.view')->middleware('access.check:'. MenuDB::USER_AR .',r');
            Route::get('/list-user-request', 'listUser')->name('list.user')->middleware('access.check:'. MenuDB::USER_AR .',r');
            
            Route::get('/detail-user', 'detailUserView')->name('detail.user.view')->middleware('access.check:'. MenuDB::USER_AR .',r');
            Route::get('/detail-user-request', 'detailUser')->name('detail.user')->middleware('access.check:'. MenuDB::USER_AR .',r');
            
            Route::get('/update-user', 'updateUserView')->name('update.user.view')->middleware('access.check:'. MenuDB::USER_AR .',u');
            Route::post('/update-user', 'updateUser')->name('update.user')->middleware('access.check:'. MenuDB::USER_AR .',u');
            
            Route::post('/delete-user', 'deleteUser')->name('delete.user')->middleware('access.check:'. MenuDB::USER_AR .',d');
            
            Route::get('/create-user', 'createUserView')->name('create.user.view')->middleware('access.check:'. MenuDB::USER_AR .',c');
            Route::post('/create-user', 'createUser')->name('create.user')->middleware('access.check:'. MenuDB::USER_AR .',c');
        });
        
            // user activity
            Route::controller(UserActivityController::class)->group(function () {
                Route::get('/list-user-activity', 'listUserActivityView')->name('list.user.activity.view')->middleware('access.check:'. MenuDB::USER_ACTIVITY_AR .',r');
                Route::get('/list-user-activity-request', 'listUserActivity')->name('list.user.activity')->middleware('access.check:'. MenuDB::USER_ACTIVITY_AR .',r');
            });


        });
        // end of admin


   


    // untuk local storage
        Route::prefix('/x-resource')->group(function () {
            Route::controller(ResourceController::class)->group(function () {
                Route::get('/leader-list', 'listLeader')->name('list.leader');
                Route::get('/access-right', 'listAccessRight')->name('list.access-right');
                
                Route::get('/access-right-info', 'accessRight');
            });
        });

        
        
    // disabled
        // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::controller(AccessController::class)->group(function () {
    Route::get('/access-not-allowed', 'accessNotAllowed')->name('access.not.allowed');
    Route::get('/not-allowed', 'clientAccessNotAllowed')->name('client.access.not.allowed');
});
require __DIR__.'/auth.php';
