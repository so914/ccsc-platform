<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Contest;
use App\Models\ContestParticipant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChallengerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $participants = ContestParticipant::query()
            ->with(['user:id,name,email', 'contest:id,name,year', 'category:id,name'])
            ->whereHas('contest', fn ($q) => $q->forUser($user))
            ->when($request->filled('contest'), fn ($q) => $q->where('contest_id', $request->contest))
            ->when($request->filled('category'), fn ($q) => $q->where('category_id', $request->category))
            ->when($request->filled('search'), fn ($q) => $q->whereHas('user', fn ($u) => $u->where('name', 'like', "%{$request->search}%")->orWhere('email', 'like', "%{$request->search}%")))
            ->latest('registered_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('challengers/index', [
            'participants' => $participants,
            'contests' => Contest::forUser($user)->orderByDesc('year')->get(['id', 'name', 'year']),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'contest', 'category']),
            'prefix' => $this->prefix($request),
        ]);
    }
}
