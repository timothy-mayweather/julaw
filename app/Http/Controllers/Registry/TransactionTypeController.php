<?php

namespace App\Http\Controllers\Registry;

use App\Http\Controllers\Common;
use App\Models\Registry\TransactionType;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;

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
