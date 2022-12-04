<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EmployeeController extends Common
{
    public array $update_keys = ['name','phone','email','active'];
    public array $validations = [
        'name' => 'required|string',
        'phone' => 'required|string',
        'email' => 'nullable|email',
        'active' => 'required'
    ];
    public string $modelClass = Employee::class;
    public array $selectColumns = ['id','name','phone','email','active','user_id'];

    public function keep(Request $request, array $record,$validator,$count): array
    {
        $user_id = null;
        if($record['user'] === 'Yes') {
            $user = new User([
                'name' => $record['name'],
                'email' => $record['email'],
                'phone' => $record['phone'],
                'manager' => 'No',
                'branch_id' => $request->user()->branch_id,
                'password' => Hash::make(hrtime(true)),
                'user_' => $request->user()->id,
            ]);
            if (config('database.default')==='sqlite') {
                $user->setAttribute('id',0);
                $user->setAttribute('provisional',Str::uuid()->toString());
            }
            $user->save();
            $user_id = User::where('email', $record['email'])->get()[0];

        }

        return [0,[
            'user_id' => $user_id,
            'user_' => $request->user()->id,
            'name' => $record['name'],
            'phone' => $record['phone'],
            'email' => $record['email'],
            'active' => $record['active'],
            'branch_id' => $request->user()->branch_id
        ]];
    }
}
