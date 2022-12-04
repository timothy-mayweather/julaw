<?php

use Inertia\Inertia;
use App\Http\Controllers\Route;
use App\Http\Controllers as Co;

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

Route::resource('branch' , Co\BranchController::class)->middleware('guest');


Route::resource('fuel-product', Co\FuelProductController::class);

Route::group(['middleware'=>['auth', 'verified']], static function() {


  Route::get('/meters', static function () {
    return Inertia::render('Meters');
  });

  Route::get('/dips', static function () {
    return Inertia::render('Dips');
  });


  Route::get('/dashboard', [Co\DashboardController::class, 'create'])->name('dashboard');

  Route::get('/dispensing-reg', static function () {
    return Inertia::render('Dispensing/Dispensing');
  });


  Route::get('/registerClient',[Co\ClientController::class, 'register']);
  Route::get('/main', static function () { return view('layouts.main');});
  Route::get('download/{val}',[Co\DocumentController::class, 'download']);



  Route::resource('branch-customer', Co\BranchCustomerController::class);
  Route::resource('branch-expense-type', Co\BranchExpenseTypeController::class);
  Route::resource('branch-fuel-product', Co\BranchFuelProductController::class);
  Route::resource('branch-product', Co\BranchProductController::class);
  Route::resource('branch-receivable-type', Co\BranchReceivableTypeController::class);
  Route::resource('branch-transaction-type', Co\BranchTransactionTypeController::class);
  Route::resource('customer', Co\CustomerController::class);
  Route::resource('debt', Co\DebtController::class);
  Route::resource('dip', Co\DipController::class);
  Route::resource('employee', Co\EmployeeController::class);
  Route::resource('file', Co\DocumentController::class);
  Route::resource('expense', Co\ExpenseController::class);
  Route::resource('expense-type', Co\ExpenseTypeController::class);
//  Route::resource('fuel-product', Co\FuelProductController::class);
  Route::resource('fuel-stock', Co\FuelStockController::class);
  Route::resource('inventory', Co\InventoryController::class);
  Route::resource('log', Co\LogController::class);
  Route::resource('meter', Co\MeterController::class);
  Route::resource('nozzle', Co\NozzleController::class);
  Route::resource('prepaid', Co\PrepaidController::class);
  Route::resource('product', Co\ProductController::class);
  Route::resource('product-sale', Co\ProductSaleController::class);
  Route::resource('product-type', Co\ProductTypeController::class);
  Route::resource('pump', Co\PumpController::class);
  Route::resource('receivable', Co\ReceivableController::class);
  Route::resource('receivable-type', Co\ReceivableTypeController::class);
  Route::resource('summary', Co\SummaryController::class);
  Route::resource('supplier', Co\SupplierController::class);
  Route::resource('tank', Co\TankController::class);
  Route::resource('tank-stock', Co\TankStockController::class);
  Route::resource('transaction', Co\TransactionController::class);
  Route::resource('transaction-type', Co\TransactionTypeController::class);
});
require __DIR__.'/auth.php';
