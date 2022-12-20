<?php

namespace App\Http\Controllers;

use App\Models\BranchFuelProduct;
use App\Models\FuelProduct;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BranchFuelProductController extends CommonPivot
{
    public string $modelClass = BranchFuelProduct::class;
    public string $mainModelClass = FuelProduct::class;
    public array $selectColumns = ['id','price','active','product_id'];
    public array $showColumns1 = ['id', 'short_name'];

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request): Response
    {
        $validator = Validator::make($request->all(), [
            'price' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return Response($validator->errors());
        }

        $stored = new BranchFuelProduct([
            'branch_id' => $request->branch,
            'product_id' => $request->model,
            'price' => $request->price,
            'active' => $request->active,
            'user_' => $request->user()->id,
        ]);
        if (config('database.default')==='sqlite') {
            $stored->setAttribute('id',0);
            $stored->setAttribute('provisional',Str::uuid()->toString());
        }
        $stored->save();

        $stored = DB::select("select * from branch_fuel_products where product_id=$request->model and branch_id=$request->branch;")[0];
        return Response($stored->id ?? -1);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param string $id
     * @return Response
     */
    public function update(Request $request): Response
    {
//        $key = 'active';
//        if ($request->has('price')) {
//            $validator = Validator::make($request->all(), [
//                'price' => 'required|integer',
//            ]);
//            if ($validator->fails()) {
//                return Response($validator->errors());
//            }
//            $key = 'price';
//        }
//        $product = BranchFuelProduct::find($id);
//        $product[$key] = $request->input($key);
//        $product['user_'] = $request->user()->id;
//        $response = $product->save();
        return Response('$response');
    }

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
