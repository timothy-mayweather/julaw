<?php

namespace App\Http\Controllers\Registry;

use App\Http\Controllers\Common;

use App\Models\Registry\Nozzle as Main;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;


class NozzleController extends Common
{

    public string $modelClass = Main::class;
    public array $update_keys = ['tank_id', 'pump_id', 'name','active'];
    public array $validations = [
        'name' => 'required|string|max:255',
        'tank' => 'required|string',
        'pump' => 'required|string',
        'active' => 'required',
    ];

    public function in_update(string $key, array $record,object $instance,array &$custom_validations): void
    {
        if($key==='name'){
            $nozzle = DB::table('nozzles')
                ->join('pumps','pumps.id','=','nozzles.pump_id')
                ->select('nozzles.id')
                ->where([['nozzles.name','=',$record[$key]],['pumps.branch_id','=',$record['b']]])->first();

            if($nozzle!==null){
                $custom_validations['name'] = ['Name is already taken!'];
            }
        }
        $instance[$key] = $record[$key];
    }

    public function keep(Request $request, array $record, Validator $validator, int $count): array
    {
        $nozzle = DB::table('nozzles')
            ->join('pumps','pumps.id','=','nozzles.pump_id')
            ->select('nozzles.id')
            ->where([['nozzles.name','=',$record['name']],['pumps.branch_id','=',$request->b]])->first();

        if($nozzle!==null){
            $validator->errors()->add('name','Name is already taken!');
            $validator->errors()->add('row',$count);
            return [1,$validator->errors()];
        }

        return [0,[
            //'id' => $this->AppId.($count+1).hrtime(true),
            'name' => $record['name'],
            'active' => $record['active'],
            'user_' => $request->user()->id,
            'pump_id' => $record['pump'],
            'tank_id' => $record['tank'],
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
        $b=$request->user()->branch_id;
        if(str_starts_with($val,'_')){
            if($request->user()->manager==="No") {
                $nozzles = DB::select("select n.id, max(ifnull(m.id,n.id*1000)) as meter_id, ifnull(m.nozzle_id,n.id) as nozzle_, ifnull(m.closing,0) as opening, n.name, bfp.price, bfp.id as fuel from nozzles n left join meters m on n.id = m.nozzle_id
                        inner join tanks t on t.id = n.tank_id inner join branch_fuel_products bfp on bfp.id = t.fuel_id where bfp.branch_id=" . $request->user()->branch_id . " group by nozzle_");
            }
            else{
                $bi=$request->user()->branch_id.$this->date_to_int($request->data_date);
                $nozzles = DB::select("select n.id, max(ifnull(m.id,n.id*-1000)) as meter_id, max(ifnull(mm.id,n.id*-1000)) as mmeter_id, ifnull(m.nozzle_id,n.id) as nozzle_, max(ifnull(mm.closing,0)) as opening, case when m.branch_int_date==".$bi." then max(m.closing) else 0 end as closing,
                                            case when m.branch_int_date==".$bi." then sum(m.rtt) else 0 end as rtt, n.name, case when m.branch_int_date==".$bi." then m.price else bfp.price end as price, bfp.id as fuel from nozzles n left join meters m on n.id = m.nozzle_id
                                            left join main_meters mm on n.id = mm.nozzle_id inner join tanks t on t.id = n.tank_id inner join branch_fuel_products bfp on bfp.id = t.fuel_id where bfp.branch_id=".$b." group by nozzle_;");
            }
        }
        else {
            $nozzles = DB::table('nozzles')
                ->join('pumps', 'pumps.id', '=', 'nozzles.pump_id')
                ->join('tanks', 'tanks.id', '=', 'nozzles.tank_id')
                ->select('nozzles.id', 'nozzles.name', 'nozzles.active', 'nozzles.pump_id', 'pumps.name as pump', 'nozzles.tank_id', 'tanks.name as tank')
                ->where('pumps.branch_id', $request->user()->branch_id)->get();
        }
        return Response($nozzles);
    }

}
