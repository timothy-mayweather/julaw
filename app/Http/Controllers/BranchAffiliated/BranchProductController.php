<?php

namespace App\Http\Controllers\BranchAffiliated;

use App\Models\BranchAffiliated\BranchProduct;
use App\Models\Registry\Product;
use App\Models\Registry\ProductType;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use function App\Http\Controllers\str_contains;

class BranchProductController extends BranchAffiliated
{
    public string $modelClass = BranchProduct::class;
    public string $mainModelClass = Product::class;

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

        return parent::show($request, $request->user()->branch_id);
    }
}
