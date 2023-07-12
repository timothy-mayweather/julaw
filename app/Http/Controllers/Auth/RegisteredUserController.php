<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\BranchAffiliated\Branch;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', ['branches'=>Branch::select(['id','name'])->get()]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @param Request $request
     * @return Response|RedirectResponse
     */
    public function store(Request $request): Response | RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required',
            'branch' => 'required',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'manager' => 'No',
            'provisional' => Str::uuid()->toString(),
            'employee_provisional' => Str::uuid()->toString(),
            'branch_id' => $request->branch,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }

    public function show(): \Illuminate\Http\Response
    {
        return Response(User::all());
    }
}
