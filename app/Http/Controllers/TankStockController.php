<?php

namespace App\Http\Controllers;

use App\Models\TankStock;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class TankStockController extends Common
{
    use Helpers;

    public array $update_keys = ['quantity','stock'];
    public array $validations = [
        'quantity' => 'required|numeric',
        'tank' => 'required|integer',
        'stock' => 'required|integer',
        'tankFuel' => 'required|integer',
        'stockFuel' => 'required|integer'
    ];
    public string $modelClass = TankStock::class;
    public array $selectColumns = ['id','quantity','stock','tank'];

    public function keep(Request $request, array $record,$validator,$count): array
    {
        $unique_int = $record['stock'].$record['tank'];
        $stock = $this->modelClass::select('unique_int')->where('unique_int',$unique_int)->get();
        if (count($stock)>0){
            $validator->errors()->add('entry','Identical entry already exists!');
            $validator->errors()->add('row', $count);
            return [1,$validator->errors()];
        }
        if ($record['tankFuel']!==$record['stockFuel']){
            $validator->errors()->add('entry','Stock and tank have different fuel!');
            $validator->errors()->add('row', $count);
            return [1,$validator->errors()];
        }
        return [0,[
            //'id' => $this->AppId.($count+1).hrtime(true),
            'user_' => $request->user()->id,
            'branch_id' => $request->user()->branch_id,
            'quantity' => $record['quantity'],
            'stock_id' => $record['stock'],
            'tank_id' => $record['tank'],
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
        if(str_starts_with($val,'_')){
            $b=$request->user()->branch_id;
            $bi=$request->user()->branch_id . $this->date_to_int($request->data_date);

            $stock = DB::select("select m.id, m.name, round(m.meters,2) as meters, max(d.branch_int_date) as bid1, ifnull(d.closing,0) as opening, max(ts.branch_int_date) as bid2, round(ifnull(sum(ts.quantity),0),2) as stock from (select t.id, t.name, ifnull(ft.meters,0) as meters from tanks t left join (select t.id as tank_id, sum(ifnull(m.closing-m.rtt-m.opening,0)) as meters from nozzles n inner join tanks t on t.id = n.tank_id left join main_meters m on n.id = m.nozzle_id where m.branch_int_date=$bi group by t.id) ft on t.id = ft.tank_id where t.branch_id=$b) m
            left join dips d on m.id=d.tank_id left join tank_stock ts on ts.tank_id=m.id group by m.id");
        }
        else {
            $stock = DB::table('tank_stock')
                ->join('tanks', 'tanks.id', '=', 'tank_stock.tank_id')
                ->join('fuel_stock', 'fuel_stock.id', '=', 'tank_stock.stock_id')
                ->join('branch_fuel_products', 'branch_fuel_products.id', '=', 'fuel_stock.fuel_id')
                ->join('fuel_products', 'fuel_products.id', '=', 'branch_fuel_products.product_id')
                ->select('tank_stock.id', 'tank_stock.tank_id', 'tank_stock.quantity', 'tank_stock.stock_id', 'tanks.name as tank', 'fuel_stock.stock_no', 'fuel_stock.quantity as stockQuantity', 'branch_fuel_products.id as fuel_id', 'fuel_products.short_name as fuel')
                ->where('fuel_stock.branch_int_date', $request->user()->branch_id . $this->date_to_int($request->data_date))->get();
            foreach ($stock as $s) {
                $s->stock = $s->fuel . ' stock ' . $s->stock_no . ' => ' . $s->stockQuantity;
            }
        }
        return Response($stock);
    }

    public function in_update(string $key, array $record, object $instance, array &$custom_validations): void
    {
        if ($key==='stock') {
            $unique_int = $record['stock'].$instance['tank_id'];
            $stock = $this->modelClass::select('unique_int')->where('unique_int',$unique_int)->get();
            if (count($stock)>0){
                $custom_validations['entry'] = ['Identical entry already exists!'];
            }
            else {
                $dat = DB::table('fuel_stock')
                    ->join('tanks', 'tanks.fuel_id', '=', 'fuel_stock.fuel_id')
                    ->select('fuel_stock.id')
                    ->where([['fuel_stock.id', "=",$record['stock']],['tanks.id',"=",$instance['tank_id']]])->get();
                if(count($dat)===0) { $custom_validations['entry'] = ['Different fuel for tank and stock!']; }
            }
            $instance["stock_id"] = $record['stock'];
            $instance['unique_int'] = $unique_int;
        } else {
            $instance[$key] = $record[$key];
        }
    }
}
