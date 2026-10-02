<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserListController extends Controller
{
    public function participants(Request $request)
    {
        return Inertia::render('admin/participants/index', [
            'participants' => User::role('participant')
                ->withCount('workshopRegistrations')
                ->when($request->filled('search'), fn ($q) => $q->where(fn ($w) => $w->where('name', 'like', "%{$request->search}%")->orWhere('email', 'like', "%{$request->search}%")))
                ->orderBy('name')
                ->paginate(20)
                ->withQueryString(),
            'filters' => $request->only('search'),
        ]);
    }
}
