<?php

use App\Http\Controllers as Co;
use App\Http\Controllers\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', static function () {
    return Inertia::render('RegisterBranch', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::resource('branch' , Co\BranchAffiliated\BranchController::class)->middleware('guest');


Route::resource('fuel-product', Co\Registry\FuelProductController::class);

Route::group(['middleware'=>['auth', 'verified']], static function() {


    Route::get('/meters', static function () {
        return Inertia::render('Meters');
    });

    Route::get('/dips', static function () {
        return Inertia::render('Dips');
    });

    Route::get('/products-reg', static function () {
        return Inertia::render('RegisterProducts/RegisterProducts');
    });

    Route::get('/dashboard', [Co\DashboardController::class, 'create'])->name('dashboard');

    Route::get('/dispensing-reg', static function () {
        return Inertia::render('Dispensing/Dispensing');
    });

    Route::get('/transaction-reg', static function () {
        return Inertia::render('TransactionRegistration');
    });

    Route::get('/receivable-reg', static function () {
        return Inertia::render('ReceivableRegistration');
    });

    Route::get('/expense-reg', static function () {
        return Inertia::render('ExpenseRegistration');
    });

    Route::get('/suppliers-customers-reg', static function () {
        return Inertia::render('SuppliersCustomers/SuppliersCustomers');
    });


    Route::get('/registerClient',[Co\Registry\ClientController::class, 'register']);
    Route::get('/main', static function () { return view('layouts.main');});
    Route::get('download/{val}',[Co\Records\DocumentController::class, 'download']);



    Route::resource('branch-customer', Co\BranchAffiliated\BranchCustomerController::class);
    Route::resource('branch-expense-type', Co\BranchAffiliated\BranchExpenseTypeController::class);
    Route::resource('branch-fuel-product', Co\BranchAffiliated\BranchFuelProductController::class);
    Route::resource('branch-product', Co\BranchAffiliated\BranchProductController::class);
    Route::resource('branch-receivable-type', Co\BranchAffiliated\BranchReceivableTypeController::class);
    Route::resource('branch-transaction-type', Co\BranchAffiliated\BranchTransactionTypeController::class);
    Route::resource('customer', Co\Registry\CustomerController::class);
    Route::resource('debt', Co\Records\DebtController::class);
    Route::resource('dip', Co\Records\DipController::class);
    Route::resource('employee', Co\Registry\EmployeeController::class);
    Route::resource('employee-role', Co\Registry\EmployeeRoleController::class);
    Route::resource('expense', Co\Records\ExpenseController::class);
    Route::resource('expense-type', Co\Registry\ExpenseTypeController::class);
    Route::resource('file', Co\Records\DocumentController::class);
//  Route::resource('fuel-product', Co\FuelProductController::class);
    Route::resource('fuel-stock', Co\Records\FuelStockController::class);
    Route::resource('inventory', Co\Records\InventoryController::class);
    Route::resource('log', Co\LogController::class);
    Route::resource('meter', Co\Records\MeterController::class);
    Route::resource('nozzle', Co\Registry\NozzleController::class);
    Route::resource('prepaid', Co\Records\PrepaidController::class);
    Route::resource('product', Co\Registry\ProductController::class);
    Route::resource('product-sale', Co\Records\ProductSaleController::class);
    Route::resource('product-type', Co\Registry\ProductTypeController::class);
    Route::resource('pump', Co\Registry\PumpController::class);
    Route::resource('receivable', Co\Records\ReceivableController::class);
    Route::resource('receivable-type', Co\Registry\ReceivableTypeController::class);
    Route::resource('summary', Co\SummaryController::class);
    Route::resource('supplier', Co\Registry\SupplierController::class);
    Route::resource('tank', Co\Registry\TankController::class);
    Route::resource('tank-stock', Co\Records\TankStockController::class);
    Route::resource('transaction', Co\Records\TransactionController::class);
    Route::resource('transaction-type', Co\Registry\TransactionTypeController::class);
});
require __DIR__.'/auth.php';
