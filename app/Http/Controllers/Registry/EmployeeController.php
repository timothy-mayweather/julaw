<?php

namespace App\Http\Controllers\Registry;

use App\Http\Controllers\Common;
use App\Models\Registry\Employee;
use App\Models\Registry\EmployeeRole;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EmployeeController extends Common
{
    public array $update_keys = ['name','phone','email','role','active'];
    public array $validations = [
        'name' => 'required|string',
        'phone' => 'required|string',
        'email' => 'nullable|email',
        'role' => 'required|integer',
        'active' => 'required'
    ];

    public string $modelClass = Employee::class;
    public array $selectColumns = ['id','name','phone','email','role', 'active','user_id'];

    public function index(): Response
    {
        $products = Employee::addSelect(['role_name' => EmployeeRole::select(['role'])->whereColumn('id','employees.role')])->get();
        return Response($products);
    }

    public function keep(Request $request, array $record,$validator,$count): array
    {
        return [0,[
            'user_' => $request->user()->id,
            'name' => $record['name'],
            'phone' => $record['phone'],
            'email' => $record['email'],
            'role' => $record['role'],
            'active' => $record['active'],
            'branch_id' => $request->user()->branch_id
        ]];
    }
}
