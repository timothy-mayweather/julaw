<?php

namespace App\Http\Controllers\Registry;

//use App\Models\Product;
use App\Http\Controllers\Common;
use App\Models\Registry\ProductType;
use Illuminate\Http\Request;

//use Illuminate\Support\Facades\Validator;
//use Illuminate\Support\Str;
//use Illuminate\Validation\ValidationException;

class ProductTypeController extends Common
{
    public array $update_keys = ['type'];
    public array $validations = ['type' => 'required|string|max:255|unique:product_types'];
    public string $modelClass = ProductType::class;
    public array $indexColumns = ['id','type'];
    public string $showModel = 'type';

    public function keep(Request $request, array $record,$validator,$count): array{
        return [0,[
            'type' => $record['type'],
            'user_' => $request->user()->id,
        ]];
    }
}
