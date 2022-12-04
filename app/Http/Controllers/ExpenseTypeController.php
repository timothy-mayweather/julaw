<?php

namespace App\Http\Controllers;

use App\Models\ExpenseType;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ExpenseTypeController extends Common
{
    public string $modelClass = ExpenseType::class;
    public array $validations = [
        'name' => 'required|string|max:255|unique:expense_types',
        'description'=>'nullable|string',
        'active' => 'required'
    ];
    public array $update_keys = ['description', 'name', 'active'];

    public function keep(Request $request, array $record, Validator $validator, int $count): array
    {
        return [0,[
            'user_' => $request->user()->id,
            'name' => $record['name'],
            'description' => $record['description'],
            'active' => $record['active'],
        ]];
    }

}
