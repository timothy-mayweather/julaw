<?php

namespace App\Http\Controllers;

use App\Models\BranchFuelProduct;
use App\Models\Meter;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class MeterController extends CommonDoubleTables
{
    use Helpers;

    public array $update_keys = ['opening','rtt','closing','price'];
    public array $validations = [
        'opening' => 'required|numeric',
        'closing' => 'required|numeric',
        'rtt' => 'required|numeric',
        'price' => 'required|numeric',
        'nozzle' => 'integer',
        'fuel' => 'integer',
        'oldPrice' => 'numeric',
    ];

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->modelClass = Meter::class;
    }

    public function keep(Request $request, array $record,$validator,$count): array
    {
        if($request->user()->manager==="No") {
            $unique_int = $record['nozzle'] . $request->shift . $this->date_to_int($request->data_date);
            $meters = $this->modelClass::select('unique_int')->where('unique_int', $unique_int)->get();
            if (count($meters) > 0) {
                $validator->errors()->add('meter', 'Record already exists');
                $validator->errors()->add('row', $count);
                return [1, $validator->errors()];
            }
            if ($record['price'] !== $record['oldPrice']) {
                BranchFuelProduct::where('id', $record['fuel'])->update(['price' => $record['price']]);
            }
            return [0, [
                //'id' => $this->AppId.($count+1).hrtime(true),
                'user_' => $request->user()->id,
                'user_id' => $request->user()->id,
                'branch_id' => $request->user()->branch_id,
                'nozzle_id' => $record['nozzle'],
                'opening' => $record['opening'],
                'rtt' => $record['rtt'],
                'closing' => $record['closing'],
                'price' => $record['price'],
                'shift' => $request->shift,
                'record_date' => $request->data_date,
                'user_shift_date' => $request->user()->id . $request->shift . $this->date_to_int($request->data_date),
                'unique_int' => $unique_int,
                'branch_int_date' => $request->user()->branch_id . $this->date_to_int($request->data_date),
            ]];
        }

        $unique_int = ((string)$record['nozzle']).$this->date_to_int($request->data_date);

        $meters = $this->getModelObject()->select('unique_int')->where('unique_int',$unique_int)->get();
        if (count($meters)>0){
            $validator->errors()->add('meter','Record already exists');
            $validator->errors()->add('row', $count);
            return [1,$validator->errors()];
        }

        if($record['price']!==$record['oldPrice']) {
            BranchFuelProduct::where('id', $record['fuel'])->update(['price' => $record['price']]);
        }

        return [0,[
            'user_' => $request->user()->id,
            'branch_id' => $request->user()->branch_id,
            'nozzle_id' => $record['nozzle'],
            'opening' => $record['opening'],
            'rtt' => $record['rtt'],
            'closing' => $record['closing'],
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
     * @return Response
     */
    public function show(Request $request): Response
    {
        if($request->user()->manager==="No") {
            return Response(DB::select("select m.id, n.name as nozzle, m.nozzle_id, m.opening, m.closing, m.rtt, m.price, m.closing-m.rtt-m.opening as litres, (m.closing-m.rtt-m.opening)*m.price as amount from meters m inner join nozzles n on n.id = m.nozzle_id where user_shift_date=".$request->user()->id.$request->shift.$this->date_to_int($request->data_date)));
        }
        return Response(DB::select("select m.id, n.name as nozzle, m.nozzle_id, m.opening, m.closing, m.rtt, m.price, round(m.closing-m.rtt-m.opening,2) as litres, round(round(m.closing-m.rtt-m.opening,2)*m.price) as amount from main_meters m inner join nozzles n on n.id = m.nozzle_id where m.branch_int_date=".$request->user()->branch_id.$this->date_to_int($request->data_date)));
    }
}
