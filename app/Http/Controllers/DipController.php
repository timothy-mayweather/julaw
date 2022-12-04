<?php

namespace App\Http\Controllers;

use App\Models\Dip;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class DipController extends Common
{
    use Helpers;

    public array $update_keys = ['closing','opening'];
    public array $validations = [
        'opening' => 'required|numeric',
        'closing' => 'required|numeric',
        'tank' => 'integer'
    ];
    public string $modelClass = Dip::class;

    public function keep(Request $request, array $record,$validator,$count): array
    {
        $unique_int = $record['tank'].$this->date_to_int($request->data_date);
        $dips = $this->modelClass::select('unique_int')->where('unique_int',$unique_int)->get();
        if (count($dips)>0){
            $validator->errors()->add('dip','Record already exists');
            $validator->errors()->add('row', $count);
            return [1,$validator->errors()];
        }
        return [0,[
            //'id' => $this->AppId.($count+1).hrtime(true),
            'user_' => $request->user()->id,
            'branch_id' => $request->user()->branch_id,
            'opening' => $record['opening'],
            'closing' => $record['closing'],
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
        $bi = $request->user()->branch_id . $this->date_to_int($request->data_date);
        $b = $request->user()->branch_id;
        if(str_starts_with($val,'_')){
            $dips = DB::select("select d.id, t.name as tank, d.opening, k.stock as new, ifnull(s.byMeters,0) as actual, round(d.opening+k.stock-ifnull(s.byMeters,0),2) as closing, d.closing as per_dips, round(d.opening+k.stock-ifnull(s.byMeters,0)-d.closing,2) as loss from dips d inner join tanks t on t.id = d.tank_id inner join
            (select t.id, ifnull(m.qty,0) as stock from tanks t left join (select t.id, sum(ts.quantity) as qty from tanks t left join tank_stock ts on t.id = ts.tank_id where branch_int_date=$bi group by t.id) m on t.id=m.id where branch_id=$b) k on k.id=t.id
            left join (select t.id, round(sum(p.closing-p.rtt-p.opening),2) as byMeters from main_meters p inner join nozzles n on n.id = p.nozzle_id inner join tanks t on t.id = n.tank_id where branch_int_date=$bi group by t.id) s on t.id=s.id where d.branch_int_date=$bi;");
        }
        else {
            $dips = DB::select("select d.id, t.name as tank, d.opening, k.stock, d.closing, round(d.opening+k.stock-d.closing,2) as byDips, ifnull(s.byMeters,0) as byMeters, round(d.opening+k.stock-d.closing-ifnull(s.byMeters,0),2) as diff from dips d inner join tanks t on t.id = d.tank_id inner join
            (select t.id, ifnull(m.qty,0) as stock from tanks t left join (select t.id, sum(ts.quantity) as qty from tanks t left join tank_stock ts on t.id = ts.tank_id where branch_int_date=$bi group by t.id) m on t.id=m.id where branch_id=$b) k on k.id=t.id
            left join (select t.id, round(sum(p.closing-p.rtt-p.opening),2) as byMeters from main_meters p inner join nozzles n on n.id = p.nozzle_id inner join tanks t on t.id = n.tank_id where branch_int_date=$bi group by t.id) s on t.id=s.id where d.branch_int_date=$bi;");
        }
        return Response($dips);
    }
}
