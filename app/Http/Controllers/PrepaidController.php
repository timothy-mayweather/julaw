<?php

namespace App\Http\Controllers;

use App\Models\Prepaid;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class PrepaidController extends CommonDoubleTables
{
    use Helpers;

    public array $update_keys = ['name','description','deposit','taken'];
    public array $validations = [
        'name' => 'required|integer',
        'description' => 'string|nullable',
        'deposit' => 'numeric|nullable',
        'taken' => 'numeric|nullable',
    ];

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->modelClass = Prepaid::class;
        $this->modelObject = new Prepaid();
        $this->modelObject->change_table();
    }

    public function keep(Request $request, array $record,$validator,$count): array
    {
        if($record['taken'] === null && $record['deposit'] === null){
            $validator->errors()->add('prepaid', 'Fill either deposit or taken field!');
            $validator->errors()->add('row', $count);
            return [1, $validator->errors()];
        }

        if($request->user()->manager==="No") {
            $unique_int = $record['name'] . $request->shift . $this->date_to_int($request->data_date);
            $selected = $this->modelClass::select('unique_int')->where('unique_int', $unique_int)->get();

            if (count($selected) > 0) {
                $validator->errors()->add('prepaid', 'Record already exists');
                $validator->errors()->add('row', $count);
                return [1, $validator->errors()];
            }

            return [0, [
                'user_' => $request->user()->id,
                'branch_id' => $request->user()->branch_id,

                'parent_id' => $record['name'],
                'description' => $record['description'],
                'deposit' => $record['deposit'],
                'taken' => $record['taken'],

                'shift' => $request->shift,
                'record_date' => $request->data_date,
                'user_shift_date' => $request->user()->id . $request->shift . $this->date_to_int($request->data_date),
                'unique_int' => $unique_int,
                'branch_int_date' => $request->user()->branch_id . $this->date_to_int($request->data_date),
            ]];
        }

        $unique_int = $record['name'].$this->date_to_int($request->data_date);
        $selected = $this->modelObject->select('unique_int')->where('unique_int',$unique_int)->get();
        if (count($selected)>0){
            $validator->errors()->add('prepaid','Record already exists');
            $validator->errors()->add('row', $count);
            return [1,$validator->errors()];
        }

        return [0,[
            'user_' => $request->user()->id,
            'branch_id' => $request->user()->branch_id,

            'parent_id' => $record['name'],
            'description' => $record['description'],
            'deposit' => $record['deposit'],
            'taken' => $record['taken'],

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
            return Response(DB::select("select d.id, d.description, d.taken, d.deposit, c.short as name, bc.id as customer from prepaids d inner join branch_customers bc on d.parent_id = bc.id inner join customers c on c.id = bc.customer_id where user_shift_date=".$request->user()->id.$request->shift.$this->date_to_int($request->data_date)));
        }
        return Response(DB::select("select d.id, d.description, d.taken, d.deposit, c.short as name, bc.id as customer from main_prepaids d inner join branch_customers bc on d.parent_id = bc.id inner join customers c on c.id = bc.customer_id where d.branch_int_date=".$request->user()->branch_id.$this->date_to_int($request->data_date)));
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
            $unique_int = $request->input($key) . $this->date_to_int($request->data_date);
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
