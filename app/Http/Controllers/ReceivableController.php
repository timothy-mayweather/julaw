<?php

namespace App\Http\Controllers;

use App\Models\Receivable;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class ReceivableController extends CommonDoubleTables
{
    use Helpers;

    public array $update_keys = ['amount','description','name'];
    public array $validations = [
        'amount' => 'required|numeric',
        'description' => 'string',
        'receivable' => 'required|integer',
    ];

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->modelClass = Receivable::class;
        $this->modelObject = new Receivable();
        $this->modelObject->change_table();
    }

    public function keep(Request $request, array $record,$validator,$count): array
    {
        if($request->user()->manager==="No") {
            $unique_int = $record['receivable'] . $request->shift . $this->date_to_int($request->data_date);
            $selected_records = $this->modelClass::select('unique_int')->where('unique_int', $unique_int)->get();
            if (count($selected_records) > 0) {
                $validator->errors()->add('receivable', 'Record already exists');
                $validator->errors()->add('row', $count);
                return [1, $validator->errors()];
            }

            return [0, [
                'user_' => $request->user()->id,
                'branch_id' => $request->user()->branch_id,

                'parent_id' => $record['receivable'],
                'amount' => $record['amount'],
                'description' => $record['description'],

                'shift' => $request->shift,
                'record_date' => $request->data_date,
                'user_shift_date' => $request->user()->id . $request->shift . $this->date_to_int($request->data_date),
                'unique_int' => $unique_int,
                'branch_int_date' => $request->user()->branch_id . $this->date_to_int($request->data_date),
            ]];
        }

        $unique_int = $record['receivable'].$this->date_to_int($request->data_date);
        $selected_records = $this->modelObject->select('unique_int')->where('unique_int',$unique_int)->get();
        if (count($selected_records)>0){
            $validator->errors()->add('receivable','Record already exists');
            $validator->errors()->add('row', $count);
            return [1,$validator->errors()];
        }

        return [0,[
            'user_' => $request->user()->id,
            'branch_id' => $request->user()->branch_id,

            'parent_id' => $record['receivable'],
            'amount' => $record['amount'],
            'description' => $record['description'],

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
            return Response(DB::select("select r.id, r.amount, r.description, brt.id as recv_id, rt.name from receivables r inner join branch_receivable_types brt on brt.id = r.parent_id inner join receivable_types rt on rt.id = brt.recv_id where user_shift_date=" . $request->user()->id . $request->shift . $this->date_to_int($request->data_date)));
        }
        return Response(DB::select("select r.id, r.amount, r.description, brt.id as recv_id, rt.name from main_receivables r inner join branch_receivable_types brt on brt.id = r.parent_id inner join receivable_types rt on rt.id = brt.recv_id where branch_int_date=".$request->user()->branch_id.$this->date_to_int($request->data_date)));
    }

    public function in_update(string $key, Request $request, array $record, object $instance,array &$custom_validations): void
    {
        if($request->user()->manager==="No") {
            if ($key === 'name') {
                $unique_int = $request->input($key) . $request->shift . $this->date_to_int($request->data_date);
                $selected = $this->modelClass::where('unique_int', $unique_int)->get();
                if (count($selected) > 0) {
                    $custom_validations['name'] = ['Record with this name exists!'];
                }
                $instance['unique_int'] = $unique_int;
                $instance['parent_id'] = $request->input($key);
                return;
            }
        }
        else if ($key === 'name') {
            $unique_int = $request->input($key) . $request->shift . $this->date_to_int($request->data_date);
            $selected = $this->modelObject->where('unique_int', $unique_int)->get();
            if (count($selected) > 0) {
                $custom_validations['name'] = ['Record with this name exists!'];
            }
            $instance['unique_int'] = $unique_int;
            $instance['parent_id'] = $request->input($key);
            return;
        }
        $instance[$key] = $request->input($key);
    }
}
