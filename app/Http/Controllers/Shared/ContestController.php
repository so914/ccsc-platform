<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Contest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ContestController extends Controller
{
    public function index(Request $request)
    {
        $contests = Contest::query()
            ->forUser($request->user())
            ->withCount(['participants', 'exams'])
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->when($request->filled('search'), fn ($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->orderByDesc('year')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('contests/index', [
            'contests' => $contests,
            'filters' => $request->only(['search', 'status']),
            'statuses' => Contest::STATUSES,
            'prefix' => $this->prefix($request),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('contests/form', $this->formProps($request, null));
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request, null);
        $contest = Contest::create([...collect($validated)->except(['category_ids', 'agent_ids'])->all(), 'created_by' => $request->user()->id]);
        $contest->categories()->sync($validated['category_ids'] ?? []);
        $contest->agents()->sync($validated['agent_ids'] ?? []);

        return redirect()->route('admin.contests.show', $contest)->with('success', 'Concours créé.');
    }

    public function show(Request $request, Contest $contest)
    {
        Gate::authorize('view', $contest);

        $contest->load(['categories', 'agents:id,name,email', 'exams' => fn ($q) => $q->withCount('challenges')]);
        $contest->loadCount(['participants', 'results']);

        return Inertia::render('contests/show', [
            'contest' => $contest,
            'prefix' => $this->prefix($request),
        ]);
    }

    public function edit(Request $request, Contest $contest)
    {
        Gate::authorize('update', $contest);

        return Inertia::render('contests/form', $this->formProps($request, $contest));
    }

    public function update(Request $request, Contest $contest)
    {
        Gate::authorize('update', $contest);

        $validated = $this->validated($request, $contest);
        $contest->update(collect($validated)->except(['category_ids', 'agent_ids'])->all());
        $contest->categories()->sync($validated['category_ids'] ?? []);
        $contest->agents()->sync($validated['agent_ids'] ?? []);

        return redirect()->route('admin.contests.show', $contest)->with('success', 'Concours mis à jour.');
    }

    public function archive(Contest $contest)
    {
        $contest->update(['status' => 'archived']);

        return back()->with('success', 'Concours archivé.');
    }

    private function formProps(Request $request, ?Contest $contest): array
    {
        return [
            'contest' => $contest?->load(['categories:id', 'agents:id']),
            'categories' => Category::where('active', true)->orderBy('name')->get(['id', 'name']),
            'agents' => User::role('agent')->orderBy('name')->get(['id', 'name']),
            'statuses' => Contest::STATUSES,
            'tieBreakers' => Contest::TIE_BREAKERS,
        ];
    }

    private function validated(Request $request, ?Contest $contest): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'year' => ['required', 'integer', 'min:2000', 'max:2100', Rule::unique('contests')->where('name', $request->name)->ignore($contest?->id)],
            'registration_start_at' => ['nullable', 'date'],
            'registration_end_at' => ['nullable', 'date', 'after_or_equal:registration_start_at'],
            'start_at' => ['nullable', 'date'],
            'end_at' => ['nullable', 'date', 'after_or_equal:start_at'],
            'status' => ['required', Rule::in(Contest::STATUSES)],
            'tie_breakers' => ['nullable', 'array'],
            'tie_breakers.*' => [Rule::in(Contest::TIE_BREAKERS)],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['exists:categories,id'],
            'agent_ids' => ['nullable', 'array'],
            'agent_ids.*' => ['exists:users,id'],
        ]);
    }
}
