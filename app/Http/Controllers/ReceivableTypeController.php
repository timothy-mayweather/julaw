<?php

namespace App\Http\Controllers;

use App\Models\ReceivableType;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReceivableTypeController extends Common
{
    public string $modelClass = ReceivableType::class;
    public array $update_keys = ['description', 'name', 'active'];
    public array $validations = [
        'name' => 'required|string|max:255|unique:receivable_types',
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
