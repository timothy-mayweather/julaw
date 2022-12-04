<?php

namespace App\Http\Controllers;

use App\Models\FuelProduct;
use Illuminate\Http\Request;

class FuelProductController extends Common
{
    public array $update_keys = ['name','description','short_name','active'];
    public array $validations = [
        'name' => 'required|string|max:255|unique:fuel_products',
        'description' => 'nullable|string',
        'short_name' => 'required|string|max:255|unique:fuel_products',
        'active' => 'required'
    ];
    public string $modelClass = FuelProduct::class;
    public array $selectColumns = ['id','name','description','short_name','active'];

    public function keep(Request $request, array $record,$validator,$count): array
    {
        return [0,[
            //'id' => $this->AppId.($count+1).hrtime(true),
            'user_' => $request->user()->id,
            'short_name' => $record['short_name'],
            'name' => $record['name'],
            'description' => $record['description'],
            'active' => $record['active'],
        ]];
    }
}
