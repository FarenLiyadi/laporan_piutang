<?php

use App\Http\Controllers\AccessController;
use App\Http\Controllers\AccessRightController;
use App\Http\Controllers\AkunBankController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomersController;
use App\Http\Controllers\InvoicesController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\UnitController;
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
        Route::controller(BrandController::class)->group(function () {
            Route::get('/list-brand', 'index')->name('list.brand.view')->middleware('access.check:'. MenuDB::BRAND_AR .',r');
            // Route::get('/download-file-brand/{id}','accessFile')->middleware('access.check:'. MenuDB::BRAND_AR .',r');
            Route::get('/list-brand-request', 'listbrand')->middleware('access.check:'. MenuDB::BRAND_AR .',r');
            Route::post('/create-brand','store')->middleware('access.check:'. MenuDB::BRAND_AR .',c');
            Route::post('/update-brand','update')->middleware('access.check:'. MenuDB::BRAND_AR .',u');
            Route::post('/delete-brand','destroy')->middleware('access.check:'. MenuDB::BRAND_AR .',d');
            Route::post('/brand/create-inline', 'createInline')->middleware('access.check:' . MenuDB::BRAND_AR . ',c');

        });
        Route::controller(UnitController::class)->group(function () {
            Route::get('/list-unit', 'index')->name('list.unit.view')->middleware('access.check:'. MenuDB::UNIT_AR .',r');
            // Route::get('/download-file-unit/{id}','accessFile')->middleware('access.check:'. MenuDB::UNIT_AR .',r');
            Route::get('/list-unit-request', 'listunit')->middleware('access.check:'. MenuDB::UNIT_AR .',r');
            Route::post('/create-unit','store')->middleware('access.check:'. MenuDB::UNIT_AR .',c');
            Route::post('/unit/create-inline', 'createInline')->middleware('access.check:' . MenuDB::UNIT_AR . ',c');

            Route::post('/update-unit','update')->middleware('access.check:'. MenuDB::UNIT_AR .',u');
            Route::post('/delete-unit','destroy')->middleware('access.check:'. MenuDB::UNIT_AR .',d');
        });
        Route::controller(CategoryController::class)->group(function () {
            Route::get('/list-category', 'index')->name('list.category.view')->middleware('access.check:'. MenuDB::CATEGORY_AR .',r');
            // Route::get('/download-file-category/{id}','accessFile')->middleware('access.check:'. MenuDB::CATEGORY_AR .',r');
            Route::get('/list-category-request', 'listcategory')->middleware('access.check:'. MenuDB::CATEGORY_AR .',r');
            Route::post('/create-category','store')->middleware('access.check:'. MenuDB::CATEGORY_AR .',c');
            Route::post('/category/create-inline', 'createInline')->middleware('access.check:' . MenuDB::CATEGORY_AR . ',c');

            Route::post('/update-category','update')->middleware('access.check:'. MenuDB::CATEGORY_AR .',u');
            Route::post('/delete-category','destroy')->middleware('access.check:'. MenuDB::CATEGORY_AR .',d');
        });
        Route::controller(SubcategoryController::class)->group(function () {
            Route::get('/list-subcategory', 'index')->name('list.subcategory.view')->middleware('access.check:'. MenuDB::CATEGORY_AR .',r');
            // Route::get('/download-file-category/{id}','accessFile')->middleware('access.check:'. MenuDB::CATEGORY_AR .',r');
            Route::get('/list-subcategory-request', 'listsubcategory')->middleware('access.check:'. MenuDB::CATEGORY_AR .',r');
            Route::post('/create-subcategory','store')->middleware('access.check:'. MenuDB::CATEGORY_AR .',c');
            Route::post('/subcategory/create-inline', 'createInline')->middleware('access.check:' . MenuDB::CATEGORY_AR . ',c');

            Route::post('/update-subcategory','update')->middleware('access.check:'. MenuDB::CATEGORY_AR .',u');
            Route::post('/delete-subcategory','destroy')->middleware('access.check:'. MenuDB::CATEGORY_AR .',d');
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
        Route::controller(ProductController::class)->group(function () {
            Route::get('/list-product', 'listProductView')->name('list.product.view')->middleware('access.check:'. MenuDB::PRODUCT_AR .',r');
            Route::get('/list-product-request', 'listProduct')->name('list.product')->middleware('access.check:'. MenuDB::PRODUCT_AR .',r');
        
            Route::get('/detail-product', 'detailProductView')->name('detail.product.view')->middleware('access.check:'. MenuDB::PRODUCT_AR .',r');
            Route::get('/detail-product-request', 'detailProduct')->name('detail.product')->middleware('access.check:'. MenuDB::PRODUCT_AR .',r');
        
            Route::get('/update-product', 'updateProductView')->name('update.product.view')->middleware('access.check:'. MenuDB::PRODUCT_AR .',u');
            Route::post('/update-product', 'updateProduct')->name('update.product')->middleware('access.check:'. MenuDB::PRODUCT_AR .',u');
        
            Route::post('/delete-product', 'deleteProduct')->name('delete.product')->middleware('access.check:'. MenuDB::PRODUCT_AR .',d');
        
            Route::get('/create-product', 'createProductView')->name('create.product.view')->middleware('access.check:'. MenuDB::PRODUCT_AR .',c');
            Route::post('/create-product', 'createProduct')->name('create.product')->middleware('access.check:'. MenuDB::PRODUCT_AR .',c');
            Route::get('/subcategory-by-category', [ProductController::class, 'getSubcategoryByCategory'])->middleware('access.check:'. MenuDB::PRODUCT_AR .',r');


           // Cart pilih produk
            Route::get('/list-label', 'labelView')
                ->name('product.label')
                ->middleware('access.check:' . MenuDB::LABEL_AR . ',r');

            // Page print -> dari localStorage, frontend only
            Route::get('/print-label', function() {
                return Inertia::render('Product/PrintLabel');
            })
            ->name('product.print')
            ->middleware('access.check:' . MenuDB::LABEL_AR . ',r');

            Route::get('/search-product', 'searchProduct')
                ->name('product.search')
                ->middleware('access.check:' . MenuDB::LABEL_AR . ',r');
            });
        Route::controller(PembayaranController::class)->group(function () {
            Route::get('/list-pembayaran', 'listPembayaranView')->name('list.pembayaran.view')->middleware('access.check:'. MenuDB::PEMBAYARAN_AR .',r');
            Route::get('/list-pembayaran-request', 'listCustomerPembayaran')->name('list.pembayaran')->middleware('access.check:'. MenuDB::PEMBAYARAN_AR .',r');
            
            Route::get('/list-pembayaran-user', 'listPembayaranUserView')->name('list.pembayaran.user.view')->middleware('access.check:'. MenuDB::PEMBAYARAN_AR .',r');
            Route::get('/list-pembayaran-user-request', 'listPembayaranUser')->name('list.pembayaran.user')->middleware('access.check:'. MenuDB::PEMBAYARAN_AR .',r');
            
            Route::get('/pembayaran-user', 'PembayaranView')->name('pembayaran.view')->middleware('access.check:'. MenuDB::PEMBAYARAN_AR .',r');
            Route::get('/pembayaran-user-request', 'listInvoicesPembayaran')->name('list.invoices.pembayaran.view')->middleware('access.check:'. MenuDB::PEMBAYARAN_AR .',r');
            
            Route::post('/create-pembayaran', 'createPembayaran')->name('create.pembayaran')->middleware('access.check:'. MenuDB::PEMBAYARAN_AR .',c');
            
            Route::post('/delete-pembayaran', 'deletePembayaran')->name('delete.pembayaran')->middleware('access.check:'. MenuDB::PEMBAYARAN_AR .',d');
        
        });
        Route::controller(ReportController::class)->group(function () {
            // Report piutang beredar
            Route::get('/report-piutang-beredar', 'reportPiutangBeredarView')->name('report-piutang-beredar.view')->middleware('access.check:'. MenuDB::REPORT_PIUTANG_BEREDAR .',r');
            Route::get('/report-piutang-beredar-user', 'reportPiutangBeredarUserView')->name('report.piutang.beredar.user.view')->middleware('access.check:'. MenuDB::REPORT_PIUTANG_BEREDAR .',r');
            Route::get('/report-piutang-beredar-request', 'reportPiutangBeredar')->name('report-piutang-beredar')->middleware('access.check:'. MenuDB::REPORT_PIUTANG_BEREDAR .',r');

            // report pembayaran
            Route::get('/report-pembayaran', 'reportPembayaranView')->name('report.pembayaran.view')->middleware('access.check:'. MenuDB::REPORT_PEMBAYARAN .',r');
            Route::get('/report-pembayaran-user', 'reportPembayaranUserView')->name('report.pembayaran.user.view')->middleware('access.check:'. MenuDB::REPORT_PEMBAYARAN .',r');
            Route::get('/report-pembayaran-request', 'reportPembayaran')->name('report-pembayaran')->middleware('access.check:'. MenuDB::REPORT_PEMBAYARAN .',r');

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
