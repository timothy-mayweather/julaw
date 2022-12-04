<?php

namespace App\Http\Controllers;

use App\Models\BranchProduct;
use App\Models\ProductSale;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class ProductSaleController extends CommonDoubleTables
{
    use Helpers;

    public array $update_keys = ['quantity','price'];
    public array $validations = [
        'quantity' => 'required|numeric',
        'price' => 'required|numeric',
        'product' => 'required|integer',
        'oldPrice' => 'numeric',
    ];

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->modelClass = ProductSale::class;
        $this->modelObject = new ProductSale();
        $this->modelObject->change_table();
    }

    public function keep(Request $request, array $record,$validator,$count): array
    {
        if($request->user()->manager==="No") {
            $unique_int = $record['product'] . $request->shift . $this->date_to_int($request->data_date);
            $selected_records = $this->modelClass::select('unique_int')->where('unique_int', $unique_int)->get();
            if (count($selected_records) > 0) {
                $validator->errors()->add('product_sale', 'Record already exists');
                $validator->errors()->add('row', $count);
                return [1, $validator->errors()];
            }

            if ($record['price'] !== $record['oldPrice']) {
                BranchProduct::where('id', $record['product'])->update(['price' => $record['price']]);
            }

            return [0, [
                'user_' => $request->user()->id,
                'branch_id' => $request->user()->branch_id,

                'parent_id' => $record['product'],
                'quantity' => $record['quantity'],
                'price' => $record['price'],

                'shift' => $request->shift,
                'record_date' => $request->data_date,
                'user_shift_date' => $request->user()->id . $request->shift . $this->date_to_int($request->data_date),
                'unique_int' => $unique_int,
                'branch_int_date' => $request->user()->branch_id . $this->date_to_int($request->data_date),
            ]];
        }

        $unique_int = $record['product'].$this->date_to_int($request->data_date);
        $selected_records = $this->modelObject->select('unique_int')->where('unique_int',$unique_int)->get();
        if (count($selected_records)>0){
            $validator->errors()->add('product_sale','Record already exists');
            $validator->errors()->add('row', $count);
            return [1,$validator->errors()];
        }

        if($record['price']!==$record['oldPrice']) {
            BranchProduct::where('id', $record['product'])->update(['price' => $record['price']]);
        }

        return [0,[
            'user_' => $request->user()->id,
            'branch_id' => $request->user()->branch_id,

            'parent_id' => $record['product'],
            'quantity' => $record['quantity'],
            'price' => $record['price'],

            'record_date' => $request->data_date,
            'unique_int' => $unique_int,
            'branch_int_date' => $request->user()->branch_id.$this->date_to_int($request->data_date),
        ]];
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param string $val
     * @return Response
     */
    public function show(Request $request,string $val): Response
    {
        if($request->user()->manager==="No") {
            return Response(DB::select("select ps.id, pt.type, ps.quantity, ps.price, ps.quantity*ps.price as amount, bp.id as product_id, p.short_name as name from product_sales ps inner join branch_products bp on bp.id = ps.parent_id inner join products p on p.id = bp.product_id inner join product_types pt on pt.id = p.type where user_shift_date=" . $request->user()->id . $request->shift . $this->date_to_int($request->data_date)));
        }
        return Response(DB::select("select ps.id, pt.type, ps.quantity, ps.price, ps.quantity*ps.price as amount, bp.id as product_id, p.short_name as name from main_product_sales ps inner join branch_products bp on bp.id = ps.parent_id inner join products p on p.id = bp.product_id inner join product_types pt on pt.id = p.type where branch_int_date=".$request->user()->branch_id.$this->date_to_int($request->data_date)));
    }
}
