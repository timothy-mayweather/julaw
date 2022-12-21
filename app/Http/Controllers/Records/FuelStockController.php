<?php

namespace App\Http\Controllers\Records;

use App\Http\Controllers\Common;

use App\Models\Records\FuelStock;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;


class FuelStockController extends Common
{


    public array $update_keys = ['unit_price','quantity','stock_no','supplier','file'];
    public array $validations = [
        'price' => 'required|numeric',
        'quantity' => 'required|numeric',
        'stockNo' => 'required|integer',
        'supplier' => 'required|numeric',
        'file' => 'nullable|numeric',
        'fuel' => 'required|numeric',
        'stock_no' => 'integer'
    ];
    public string $modelClass = FuelStock::class;
    public array $selectColumns = ['id','unit_price','quantity','amount','stock_no','supplier_id','document_id','fuel_id'];

    public function keep(Request $request, array $record,$validator,$count): array
    {
        $unique_int = $request->user()->branch_id.$this->date_to_int($request->data_date).$record['stockNo'].$record['fuel'];
        $stock = $this->modelClass::select('unique_int')->where('unique_int',$unique_int)->get();
        if (count($stock)>0){
            $validator->errors()->add('stock','Stock number of product exists!');
            $validator->errors()->add('row', $count);
            return [1,$validator->errors()];
        }
        return [0,[
            //'id' => $this->AppId.($count+1).hrtime(true),
            'user_' => $request->user()->id,
            'branch_id' => $request->user()->branch_id,
            'unit_price' => $record['price'],
            'quantity' => $record['quantity'],
            'stock_no' => $record['stockNo'],
            'supplier_id' => $record['supplier'],
            'document_id' => $record['file'],
            'fuel_id' => $record['fuel'],
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
        if (str_starts_with($val,'_')) {
            $stock = DB::table('fuel_stock')
                ->join('branch_fuel_products', 'branch_fuel_products.id', '=', 'fuel_stock.fuel_id')
                ->join('fuel_products', 'fuel_products.id', '=', 'branch_fuel_products.product_id')
                ->select('fuel_stock.id', 'fuel_stock.fuel_id', 'fuel_stock.stock_no', 'fuel_stock.quantity', 'fuel_products.short_name as fuel')
                ->where('fuel_stock.branch_int_date', $request->user()->branch_id . $this->date_to_int($request->data_date))->get();
            foreach ($stock as $s){
                $s->name = $s->fuel.' stock '.$s->stock_no.' => '.$s->quantity;
            }
        } else {
            $stock = DB::table('fuel_stock')
                ->join('branch_fuel_products', 'branch_fuel_products.id', '=', 'fuel_stock.fuel_id')
                ->join('fuel_products', 'fuel_products.id', '=', 'branch_fuel_products.product_id')
                ->join('suppliers', 'suppliers.id', '=', 'fuel_stock.supplier_id')
                ->leftJoin('documents', 'documents.id', '=', 'fuel_stock.document_id')
                ->select('fuel_stock.id', 'fuel_stock.fuel_id', 'fuel_stock.supplier_id', 'fuel_stock.stock_no', 'fuel_stock.unit_price', 'fuel_stock.quantity', 'fuel_stock.document_id', 'fuel_products.short_name as fuel', 'suppliers.name as supplier', 'documents.name as file')
                ->where('fuel_stock.branch_int_date', $request->user()->branch_id . $this->date_to_int($request->data_date))->get();
        }
        return Response($stock);
    }

    public function in_update(string $key, array $record, object $instance, array &$custom_validations): void
    {
        switch ($key){
            case 'file': case 'supplier':
                $instance[["file"=>"document_id","supplier"=>"supplier_id"][$key]] = $record[$key];
                break;
            case 'stock_no':
                $fuel = $instance['fuel_id'];
                $stock_no = (array_key_exists('stock_no',$record))?$record['stock_no']:$instance['stock_no'];
                $unique_int = $instance['branch_int_date'].$stock_no.$fuel;
                $stock = $this->modelClass::select('unique_int')->where('unique_int',$unique_int)->get();
                if (count($stock)>0) { $custom_validations['entry'] = ['Identical entry already exists!']; }
                $instance["stock_no"] = $record[$key];
                $instance['unique_int'] = $unique_int;
                break;
            case 'fuel':
                break;
            default:
                $instance[$key] = $record[$key];
        }
    }
}
