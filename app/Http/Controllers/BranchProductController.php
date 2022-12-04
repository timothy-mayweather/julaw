<?php

namespace App\Http\Controllers;

use App\Models\BranchProduct;
use App\Models\Product;
use App\Models\ProductType;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BranchProductController extends CommonPivot
{
    public string $modelClass = BranchProduct::class;
    public string $mainModelClass = Product::class;

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

        $stored = BranchProduct::create([
            'branch_id' => $request->branch,
            'product_id' => $request->model,
            'price' => $request->price,
            'active' => $request->active,
            'user_' => $request->user()->id,
        ]);
        return Response($stored->id ?? -1);
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param string $val
     * @return Response
     * @throws \JsonException
     */
    public function show(Request $request, string $val): Response
    {
        if(str_contains($val,'{') ){
            $arr = json_decode($val, true, 512, JSON_THROW_ON_ERROR);
            $type = ProductType::where('type',$arr['type'])->first();
            if($type===null){return Response([['id'=>'none','short_name'=>'none']]);}
            $products = Product::where('type',$type->id)
                ->join('branch_products','branch_products.product_id','=','products.id')
                ->select('products.short_name','branch_products.id','branch_products.active')
                ->where('branch_products.branch_id',$arr['branch'])->get();
            return Response(count($products)>0?$products:[['id'=>'none','short_name'=>'none','active'=>'none']]);
        }
        else if(str_contains($val,'_') ){
            return Response(DB::select("select bp.id, bp.price, p.short_name as name, pt.type from branch_products bp inner join products p on p.id = bp.product_id inner join product_types pt on p.type = pt.id where bp.branch_id=".substr($val,1)));
        }

        $products = Product::addSelect(['type_name' => ProductType::select(['type'])->whereColumn('id','products.type')])->get();
        $bProducts = BranchProduct::where('branch_id',$val)->get();
        return Response([$products,$bProducts]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param string $id
     * @return Response
     */
    public function update(Request $request, string $id): Response
    {
        $key = 'active';
        if ($request->has('price')) {
            $validator = Validator::make($request->all(), [
                'price' => 'required|integer',
            ]);
            if ($validator->fails()) {
                return Response($validator->errors());
            }
            $key = 'price';
        }
        $product = BranchProduct::find($id);
        $product[$key] = $request->input($key);
        $product['user_'] = $request->user()->id;
        $response = $product->save();
        return Response($response);
    }
}
