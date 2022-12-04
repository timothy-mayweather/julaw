<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Common
{
    use Helpers;
    public array $update_keys = ['description','record_date','name'];
    public array $validations = [
        'name' => 'string|required',
        'description' => 'nullable|string',
        'record_date' => 'date|required',
        'file' => 'file|required|max:20000'
    ];
    public string $modelClass = Document::class;
    public array $selectColumns = ['id','name','record_date','description','path'];


    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     * @throws ValidationException
     */
    public function store(Request $request): Response
    {
        $validator = Validator::make($request->all(), $this->validations);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        if($request->hasFile('file')){
            $dir = $request->dir??'other';
            $name = $request->name;
            if(str_contains($request->name,'/')){
                $arr = explode('/',$request->name);
                $name = $arr[count($arr)-1];
                $dir = str_replace('/'.$name,'',$request->name);
            }
            $path = $request->file('file')->store('public/branch'.$request->user()->branch_id.'_files/'.$dir);
            $this->modelClass::create([
                //'id' => $this->AppId.(random_int(10,1000)).hrtime(true),
                'name' => $name,
                'user_' => $request->user()->id,
                'path' => $path,
                'description' => $request->description,
                'record_date' => $request->record_date,
                'branch_id' => $request->user()->branch_id,
                'branch_int_date' => $request->user()->branch_id.$this->date_to_int($request->record_date),
            ]);
        }
        else{
            throw ValidationException::withMessages(['No file uploaded']);
        }
        return Response($request->name);
    }

    /**
     * Display the specified resource.
     * @param Request $request
     * @param string $val
     * @return Response
     */
    public function show(Request $request,string $val): Response
    {
        $files = $this->modelClass::select($this->showColumns??$this->selectColumns)->where('branch_int_date',$request->user()->branch_id.$this->date_to_int($request->data_date))->get();
        foreach ($files as $file){
            $file->alias=substr($file->path,strrpos($file->path,'/')+1);
        }
        return Response($files);
    }

    /**
     * @throws \JsonException
     */
    public function destroy(Request $request): Response
    {
        $resp = parent::destroy($request);

        if (json_decode($resp->getContent(), true, 512, JSON_THROW_ON_ERROR)["resp"]===1){
            Storage::delete($request->input('path'));
        }
        return $resp;
    }

    public function in_update(string $key, array $record,object $instance, array &$custom_validations): void
    {
        $instance[$key] = $record[$key];
        if($key==='record_date') {
            $instance['branch_int_date'] = $record['branch_id'].$this->date_to_int($record['record_date']);
        }
    }

    public function download(string $val): StreamedResponse
    {
        $file_record = DB::selectOne("select name, path from documents where id=".$val.";");
        return Storage::download($file_record->path, $file_record->name);
    }

    public function getPath(string $val): string
    {
        $file_record = DB::selectOne("select name, path from documents where id=".$val.";");
        return str_replace('app/Http/Controllers','',__DIR__).str_replace('public','public/storage',$file_record->path);
    }
}
