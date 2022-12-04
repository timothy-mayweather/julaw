<?php

namespace App\Http\Controllers;

use App\Models\Pump;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;

class PumpController extends Common
{
    public array $update_keys = ['name','description','active'];
    public array $validations = [
        'name' => 'required|string|max:255',
        'description' => 'required|string|max:255',
        'active' => 'required'
    ];
    public string $modelClass = Pump::class;
    public array $selectColumns = ['id','name','description','active'];

    public function in_update(string $key, array $record, object $instance,array &$custom_validations): void
    {
        if($key==='name') {
            $pump = Pump::where([['name', '=', $record[$key]], ['branch_id', '=', $record['b']]])->first();
            if ($pump !== null) {
                $custom_validations["name"] = ["Name is already taken!"];
            }
        }
        $instance[$key] = $record[$key];
    }

    public function keep(Request $request, array $record, Validator $validator, int $count): array
    {
        $pump = Pump::where([['name','=',$record['name']],['branch_id','=',$request->b]])->first();
        if($pump!==null){
            $validator->errors()->add('name','Name is already taken!');
            $validator->errors()->add('row',$count);
            return [1,$validator->errors()];
        }
        return [0,[
            //'id' => $this->AppId.($count+1).hrtime(true),
            'name' => $record['name'],
            'description' => $record['description'],
            'active' => $record['active'],
            'branch_id' => $request->user()->branch_id,
            'user_' => $request->user()->id,
        ]];
    }
}
