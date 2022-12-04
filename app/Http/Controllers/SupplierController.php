<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Common
{
    public array $update_keys = ['name','location','description','phone','email','active'];
    public array $validations = [
        'name' => 'required|string|max:255|unique:suppliers',
        'location' => 'required|string|max:255',
        'description' => 'nullable|string',
        'phone' => 'required|string|max:255|unique:suppliers',
        'email' => 'required|email|max:255|unique:suppliers',
        'active' => 'required'
    ];
    public string $modelClass = Supplier::class;
    public array $selectColumns = ['id','name','location','description','phone','email','active'];

    public function keep(Request $request, array $record,$validator,$count): array
    {
        return [0,[
            'user_' => $request->user()->id,
            'name' => $record['name'],
            'location' => $record['location'],
            'description' => $record['description'],
            'phone' => $record['phone'],
            'email' => $record['email'],
            'active' => $record['active'],
        ]];
    }
}
