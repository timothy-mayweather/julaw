<?php

namespace App\Http\Controllers;

use App\Models\EmployeeRole;
use Illuminate\Http\Request;

class EmployeeRoleController extends Common
{
    public array $update_keys = ['role'];
    public array $validations = ['role' => 'required|string|max:255|unique:employee_roles'];
    public string $modelClass = EmployeeRole::class;
    public array $indexColumns = ['id','role'];
    public string $showModel = 'role';

    public function keep(Request $request, array $record,$validator,$count): array{
        return [0,[
            'role' => $record['role'],
            'user_' => $request->user()->id,
        ]];
    }
}
