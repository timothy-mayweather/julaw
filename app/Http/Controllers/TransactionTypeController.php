<?php

namespace App\Http\Controllers;

use App\Models\TransactionType;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TransactionTypeController extends Common
{
    public string $modelClass = TransactionType::class;
    public array $update_keys = ['name','description','active'];
    public array $validations = [
        'name' => 'required|string|max:255|unique:transaction_types',
        'description'=>'nullable|string',
        'active' => 'required'
    ];

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
