<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CustomerController extends Common
{
    public array $update_keys = ['name','short','active'];
    public array $validations = [
        'name' => 'required|string|max:255|unique:customers',
        'short' => 'required|string|max:255|unique:customers',
        'active' => 'required',
    ];
    public string $modelClass = Customer::class;

    public function keep(Request $request,array $record,$validator,$count):array
    {
         return [0,[
             'user_' => $request->user()->id,
             'name' => $record['name'],
             'short' => $record['short'],
             'active' => $record['active'],
         ]];
    }

}
