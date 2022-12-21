<?php

namespace App\Http\Controllers\Records;

use App\Http\Controllers\CommonDoubleTables;

use App\Models\Records\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class TransactionController extends CommonDoubleTables
{


    public array $update_keys = ['name','opening','closing','deposit','withdraw'];
    public array $validations = [
        'opening' => 'required|numeric',
        'closing' => 'required|numeric',
        'deposit' => 'required|numeric',
        'withdraw' => 'required|numeric',
        'transaction' => 'required|integer',
    ];

    /**
     * Instantiate a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->modelClass = Transaction::class;
        $this->modelObject = new Transaction();
        $this->modelObject->change_table();
    }

    public function keep(Request $request, array $record,$validator,$count): array
    {
        if($request->user()->manager==="No") {
            $unique_int = $record['transaction'] . $request->shift . $this->date_to_int($request->data_date);
            $selected_records = $this->modelClass::select('unique_int')->where('unique_int', $unique_int)->get();
            if (count($selected_records) > 0) {
                $validator->errors()->add('transaction', 'Record already exists');
                $validator->errors()->add('row', $count);
                return [1, $validator->errors()];
            }

            return [0, [
                'user_' => $request->user()->id,
                'branch_id' => $request->user()->branch_id,

                'parent_id' => $record['transaction'],

                'opening' => $record['opening'],
                'closing' => $record['closing'],
                'deposit' => $record['deposit'],
                'withdraw' => $record['withdraw'],

                'shift' => $request->shift,
                'record_date' => $request->data_date,
                'user_shift_date' => $request->user()->id . $request->shift . $this->date_to_int($request->data_date),
                'unique_int' => $unique_int,
                'branch_int_date' => $request->user()->branch_id . $this->date_to_int($request->data_date),
            ]];
        }
        $unique_int = $record['transaction'].$this->date_to_int($request->data_date);
        $selected_records = $this->modelObject->select('unique_int')->where('unique_int',$unique_int)->get();
        if (count($selected_records)>0){
            $validator->errors()->add('transaction','Record already exists');
            $validator->errors()->add('row', $count);
            return [1,$validator->errors()];
        }

        return [0,[
            'user_' => $request->user()->id,
            'branch_id' => $request->user()->branch_id,

            'parent_id' => $record['transaction'],

            'opening' => $record['opening'],
            'closing' => $record['closing'],
            'deposit' => $record['deposit'],
            'withdraw' => $record['withdraw'],

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
            return Response(DB::select("select t.id, t.opening, t.closing, t.opening-t.closing as change, t.deposit, t.withdraw, t.deposit-t.withdraw as diff, btt.id as trans_id, tt.name from transactions t inner join branch_transaction_types btt on btt.id = t.parent_id inner join transaction_types tt on tt.id = btt.tr_id where user_shift_date=" . $request->user()->id . $request->shift . $this->date_to_int($request->data_date)));
        }
        return Response(DB::select("select t.id, t.opening, t.closing, t.opening-t.closing as change, t.deposit, t.withdraw, t.deposit-t.withdraw as diff, btt.id as trans_id, tt.name from main_transactions t inner join branch_transaction_types btt on btt.id = t.parent_id inner join transaction_types tt on tt.id = btt.tr_id where branch_int_date=".$request->user()->branch_id.$this->date_to_int($request->data_date)));
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
