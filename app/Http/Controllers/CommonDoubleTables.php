<?php

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class CommonDoubleTables extends Controller
{
    public array $update_keys = [];
    public array $validations = [];
    public string $modelClass;
    public object $modelObject;
    public array $selectColumns = ['*'];
    public array $indexColumns;


    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        if($request->user()->manager==="No") {
            return Response($this->modelClass::all($this->indexColumns ?? $this->selectColumns));
        }
        return $this->modelObject->get();
    }

    public function in_update(string $key, Request $request, array $record, object $instance, array &$custom_validations): void
    { $instance[$key] = $record[$key]; }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function update(Request $request): Response
    {
        $records = $request->input('records');
        $responses = [];
        foreach ($records as $id=>$record){
            $instance = ($request->user()->manager==="No")?$this->modelClass::find($id):$this->modelObject->find($id);
            $record['b'] = $request->user()->branch_id;
            if($instance===null){
                return Response(['record'=>["Record with id $id does not exist! Refresh"]]);
            }

            $validations = [];
            $custom_validations = [];
            foreach ($record as $key=>$value){
                if(in_array($key, $this->update_keys, true)){
                    $this->in_update($key,$request,$record,$instance,$custom_validations);
                    if(array_key_exists($key,$this->validations)) {
                        $validations[$key] = $this->validations[$key];
                    }
                }
            }

            $validator = Validator::make($record, $validations);

            if ($validator->fails()) {
                $responses[$id] = ['saved'=>false, 'reasons'=>$validator->errors()];
                continue;
            }

            if (count($custom_validations)>0) {
                return Response($custom_validations);
            }

            $instance['user_'] = $request->user()->id;
            $response = $instance->save();

            $responses[$id] = ['saved'=>$response];
        }
        return Response($responses);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Request $request
     * @param string $id
     * @return Response
     */
    public function destroy(Request $request, string $id): Response
    {
        $inst = $this->modelObject->find($id);
        if($request->user()->manager==="No"){
            $inst = $this->modelClass::find($id);
        }
        $resp = 0;
        if($inst) {
            try {
                $inst->user_d = $request->user()->id;
                $inst->save();
                $resp = $inst->delete();
            } catch (QueryException $e) {
                $inst->user_d = null;
                $inst->save();
                $resp = -1;
            }
        }

        return Response('{"id":"'.$id.'","resp":'.$resp.'}');
    }

    public function keep(Request $request,array $record,\Illuminate\Contracts\Validation\Validator $validator, int $count): array
    {
        return [];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request): Response
    {
        $records = $request->input('records');
        $count = 0;
        foreach ($records as $record) {
            $validator = Validator::make($record, $this->validations);

            if ($validator->fails()) {
                $validator->errors()->add('row', $count);
                return Response($validator->errors());
            }
            $arr = $this->keep($request,$record,$validator,$count);
            if($arr[0]===1){
                return Response($arr[1]);
            }

            if($request->user()->manager==="No"){
                $this->modelClass::create($arr[1]);
            }
            else{
                $this->modelObject->fill($arr[1]);
                $this->modelObject->save();
            }

            $count++;
        }
        return Response(0);
    }
}
