<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgentController extends Controller
{
    public function index(Request $request)
    {
        $agents = User::role('agent')
            ->withCount('managedContests')
            ->with('managedContests:id,name,year')
            ->when($request->filled('search'), fn ($q) => $q->where(fn ($w) => $w->where('name', 'like', "%{$request->search}%")->orWhere('email', 'like', "%{$request->search}%")))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/agents/index', [
            'agents' => $agents,
            'filters' => $request->only('search'),
        ]);
    }
}
