<?php

namespace App\Http\Controllers\BranchAffiliated;

use App\Http\Controllers\Controller;
use App\Models\BranchAffiliated\Branch;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;

class BranchController extends Controller
{
  /**
   * Store a newly created resource in storage.
   *
   * @param Request $request
   * @return RedirectResponse
   */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:branches',
            'location' => 'required|string|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $branch = Branch::create([
            'name' => strtolower($request->name),
            'location' => strtolower($request->location),
        ]);

        User::create([
            'name' => strtolower($request->name).'-manager',
            'email' => strtolower($request->name).'manager@julaw.com',
            'phone' => '-'. hrtime(true),
            'manager' => 'Yes',
            'branch_id' => $branch->id,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('login');
    }

    /**
     * Store a newly created resource in storage for api
     *
     * @param Request $request
     * @return Response|array
     */
    public function store2(Request $request): Response|array
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:branches',
            'location' => 'required|string|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        if ($validator->fails()) {
            return Response($validator->errors());
        }

        $branch = Branch::create([
            'name' => strtolower($request->name),
            'location' => strtolower($request->location),
        ]);

        User::create([
            'name' => strtolower($request->name).'-manager',
            'email' => strtolower($request->name).'manager@julaw.com',
            'phone' => '-'. hrtime(true),
            'manager' => 'Yes',
            'branch_id' => $branch->id,
            'password' => Hash::make($request->password),
        ]);

        return ["redirect" => '#register'];
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(): Response
    {
        return Response(Branch::all(['id','name']));
    }
}
