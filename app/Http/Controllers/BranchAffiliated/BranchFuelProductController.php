<?php

namespace App\Http\Controllers\BranchAffiliated;

use App\Models\BranchAffiliated\BranchFuelProduct;
use App\Models\Registry\FuelProduct;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class BranchFuelProductController extends BranchAffiliated
{
    public string $modelClass = BranchFuelProduct::class;
    public string $mainModelClass = FuelProduct::class;
    public array $selectColumns = ['id','price','active','product_id'];
    public array $showColumns1 = ['id', 'short_name'];

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param string $val
     * @return Response
     */
    public function show(Request $request, string $val): Response
    {
        if($val[0]==='_'){
            $products = DB::table('fuel_products')
                ->join('branch_fuel_products','branch_fuel_products.product_id','=','fuel_products.id')
                ->select('fuel_products.short_name','branch_fuel_products.id','branch_fuel_products.active')
                ->where('branch_fuel_products.branch_id',$request->user()->branch_id)->get();
            return Response(count($products)>0?$products:[['id'=>'none','short_name'=>'none','active'=>'none']]);
        }
        return parent::show($request, $request->user()->branch_id);
    }
}
