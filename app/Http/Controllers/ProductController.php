<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductType;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class ProductController extends Common
{
    public array $update_keys = ['name','description','short_name','type','active'];
    public array $validations = [
        'name' => 'required|string|max:255|unique:products',
        'description' => 'nullable|string',
        'short_name' => 'required|string|max:255|unique:products',
        'type' => 'required',
        'active' => 'required'
    ];
    public string $modelClass = Product::class;

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(): Response
    {
        $products = Product::addSelect(['type_name' => ProductType::select(['type'])->whereColumn('id','products.type')])->get();
        return Response($products);
    }

    public function keep(Request $request, array $record,$validator,$count): array
    {
        return [0,[
            'id' => (string) Str::uuid(),
            'user_' => $request->user()->id,
            'short_name' => $record['short_name'],
            'name' => $record['name'],
            'type' => $record['type'],
            'description' => $record['description'],
            'active' => $record['active'],
        ]];
    }
}
