<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CommonPivot extends Controller
{
    public string $modelClass;
    public string $mainModelClass;
    public string $refName;
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
     * @param string $id
     * @return Response
     */
    public function update(Request $request, string $id): Response
    {
        $updated = $this->modelClass::find($id);
        $updated['active'] = $request->input('active');
        $updated['user_'] = $request->user()->id;
        return Response($updated->save());
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
        $inst = $this->modelClass::find($id);
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

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request): Response
    {
        $stored = $this->modelClass::create([
            'branch_id' => $request->branch,
            $this->refName => $request->model,
            'active' => $request->active,
            'user_' => $request->user()->id,
        ]);
        return Response($stored->id ?? -1);
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
        $main_model = $this->mainModelClass::all($this->showColumns1);
        $b_model = $this->modelClass::where($this->showModel,$val)->select($this->showColumns2??$this->selectColumns)->get();
        return Response([$main_model,$b_model]);
    }
}
