<?php
declare(strict_types=1);

namespace App\Http\Controllers\BranchAffiliated;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BranchAffiliated extends Controller
{
    public string $modelClass;
    public string $mainModelClass;
    public array $selectColumns = ['*'];
    public array $indexColumns;
    public array $showColumns1 = ['*'];
    public array $showColumns2;
    public string $showModel = 'branch_id';

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(): Response
    {
        return Response($this->modelClass::all($this->indexColumns??$this->selectColumns));
    }

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
            $instance = $this->modelClass::find($id);
            if($instance===null){
                return Response(['record'=>["This record does not exist! Refresh"]]);
            }

            foreach ($this->modelClass::defaultData as $key=>$value){
                if(array_key_exists($key, $record)){
                    $instance[$key] = $record[$key];
                }
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
     * @return Response
     */
    public function destroy(Request $request): Response
    {
        $ids = $request->input('ids');
        $responses = [];
        foreach ($ids as $id){
            $inst = $this->modelClass::find($id);
//            $resp = 0;
//            if ($inst) {
//                try {
//                    $inst->user_d = $request->user()->id;
//                    $inst->save();
//                    $resp = $inst->delete();
//                } catch (QueryException $e) {
//                    $inst->user_d = null;
//                    $inst->save();
//                    $resp = -1;
//                }
//            }
            $responses[] = ['id'=>$id, 'resp'=>true];
        }

        return Response($responses);
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
        $alreadySaved = $this->modelClass::where('branch_id', $request->branch)->get();
        $refIds = [];
        foreach ($alreadySaved as $item){
            $refIds[] = $item[$this->modelClass::refIdName];
        }
        $response = [];
        foreach ($records as $key=>$value){
            if(in_array((int)$value[$this->modelClass::refIdName], $refIds, true)){
                $response[$key] = $key;
                continue;
            }

            $data = [
                'branch_id' => $request->branch,
                'user_' => $request->user()->id,
                $this->modelClass::refIdName => $value[$this->modelClass::refIdName],
            ];

            foreach ($this->modelClass::defaultData as $key2=>$value2){
                $data[$key2] = $value[$key2];
            }

            $modelObj = new $this->modelClass($data);

            if (config('database.default')==='sqlite') {
                $modelObj->setAttribute('id',0);
                if($modelObj->isFillable('provisional')) {
                    $modelObj->setAttribute('provisional', Str::uuid()->toString());
                }
            }
            $modelObj->save();

            $modelObj = DB::select("select * from ".$modelObj->getTable()." where ". $this->modelClass::refIdName ." = ". $value[$this->modelClass::refIdName] ." and branch_id=". $request->branch .";")[0];

            $response[$key] = $modelObj->id??$key;
        }

        return Response($response);
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param string $val
     * @return Response
     */
    public function show(Request $request, string $val): Response
    {
        $main_model = $this->mainModelClass::all($this->showColumns1)->toArray();
        $b_model = $this->modelClass::where($this->showModel,$val)->select($this->showColumns2??$this->selectColumns)->get()->toArray();
        $ids = [];

        for($i=0, $iMax = count($b_model); $i< $iMax; $i++){
            $ids[] = $b_model[$i][$this->modelClass::refIdName];
        }
        for($i=0, $iMax = count($main_model); $i< $iMax; $i++){

            if(!in_array($main_model[$i]['id'], $ids, true)){
                $defData = $this->modelClass::defaultData;
                $defData[$this->modelClass::refIdName] = $main_model[$i]['id'];
                $defData[$this->modelClass::refName] = $main_model[$i][$this->modelClass::refName];
                $defData['id'] = '0.'.($i+1);
                $b_model[] = $defData;
            }else{
                $index = array_search($main_model[$i]['id'], $ids, true);
                $b_model[$index][$this->modelClass::refName] = $main_model[$i][$this->modelClass::refName];
            }
        }
        return Response($b_model);
    }
}
