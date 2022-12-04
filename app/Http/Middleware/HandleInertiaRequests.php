<?php

namespace App\Http\Middleware;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     *
     * @param Request $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param Request $request
     * @return array
     */

    public function share(Request $request): array
    {
      $user = $request->user();
        return ($user !== null)? array_merge(parent::share($request), [
          'auth' => [
            'user' => $user->only('id', 'name', 'manager'),
            'branch' => Branch::find($user->branch_id)->only('id', 'name')
          ],
          'ziggy' => function () use ($request) {
            return array_merge((new Ziggy)->toArray(), [
              'location' => $request->url(),
            ]);
          },
        ]): array_merge(parent::share($request), [
          'auth' => [
            'user' => null,
            'branch' => null
          ],
          'ziggy' => function () use ($request) {
            return array_merge((new Ziggy)->toArray(), [
              'location' => $request->url(),
            ]);
          },
        ]);
    }
}
