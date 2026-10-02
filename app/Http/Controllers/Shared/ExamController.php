<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Challenge;
use App\Models\Contest;
use App\Models\Exam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function index(Request $request)
    {
        $exams = Exam::query()
            ->forUser($request->user())
            ->with('contest:id,name,year')
            ->withCount('challenges')
            ->when($request->filled('contest'), fn ($q) => $q->where('contest_id', $request->contest))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->when($request->filled('search'), fn ($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('exams/index', [
            'exams' => $exams,
            'contests' => Contest::forUser($request->user())->orderByDesc('year')->get(['id', 'name', 'year']),
            'statuses' => Exam::STATUSES,
            'filters' => $request->only(['search', 'contest', 'status']),
            'prefix' => $this->prefix($request),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('exams/form', $this->formProps($request, null));
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        abort_unless(Contest::findOrFail($data['contest_id'])->isManagedBy($request->user()), 403);

        $exam = Exam::create([...collect($data)->except('category_ids')->all(), 'created_by' => $request->user()->id]);
        $exam->categories()->sync($data['category_ids'] ?? []);

        return redirect()->route($this->prefix($request).'.exams.show', $exam)->with('success', 'Examen créé.');
    }

    public function show(Request $request, Exam $exam)
    {
        Gate::authorize('view', $exam);

        $exam->load(['contest:id,name,year', 'categories:id,name', 'challenges.bank:id,name']);

        return Inertia::render('exams/show', [
            'exam' => [...$exam->toArray(), 'has_attempts' => $exam->hasAttempts(), 'max_score' => $exam->maxScore()],
            'availableChallenges' => Challenge::where('status', 'active')
                ->with('bank:id,name')
                ->orderBy('title')
                ->get(['id', 'title', 'points', 'topic', 'difficulty', 'question_bank_id']),
            'prefix' => $this->prefix($request),
        ]);
    }

    public function edit(Request $request, Exam $exam)
    {
        Gate::authorize('update', $exam);

        return Inertia::render('exams/form', $this->formProps($request, $exam->load('categories:id')));
    }

    public function update(Request $request, Exam $exam)
    {
        Gate::authorize('update', $exam);

        $data = $this->validated($request);

        if ($exam->hasAttempts() && (int) $data['contest_id'] !== $exam->contest_id) {
            throw ValidationException::withMessages(['contest_id' => 'Le concours ne peut plus changer : des tentatives existent.']);
        }

        abort_unless(Contest::findOrFail($data['contest_id'])->isManagedBy($request->user()), 403);

        $exam->update(collect($data)->except('category_ids')->all());
        $exam->categories()->sync($data['category_ids'] ?? []);

        return redirect()->route($this->prefix($request).'.exams.show', $exam)->with('success', 'Examen mis à jour.');
    }

    public function syncChallenges(Request $request, Exam $exam)
    {
        Gate::authorize('update', $exam);

        if ($exam->hasAttempts()) {
            throw ValidationException::withMessages(['challenges' => 'Des tentatives existent : la composition de l\'examen est figée.']);
        }

        $data = $request->validate([
            'challenges' => ['array'],
            'challenges.*.id' => ['required', 'exists:challenges,id', 'distinct'],
            'challenges.*.points' => ['nullable', 'integer', 'min:0'],
        ]);

        $sync = [];

        foreach (array_values($data['challenges'] ?? []) as $position => $item) {
            $sync[$item['id']] = ['position' => $position, 'points' => $item['points'] ?? null];
        }

        $exam->challenges()->sync($sync);

        return back()->with('success', 'Challenges de l\'examen mis à jour.');
    }

    private function formProps(Request $request, ?Exam $exam): array
    {
        return [
            'exam' => $exam,
            'contests' => Contest::forUser($request->user())->where('status', '!=', 'archived')->orderByDesc('year')->get(['id', 'name', 'year']),
            'categories' => Category::where('active', true)->orderBy('name')->get(['id', 'name']),
            'statuses' => Exam::STATUSES,
            'prefix' => $this->prefix($request),
        ];
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'contest_id' => ['required', 'exists:contests,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'duration_minutes' => ['required', 'integer', 'min:1', 'max:1440'],
            'start_at' => ['nullable', 'date'],
            'end_at' => ['nullable', 'date', 'after:start_at'],
            'status' => ['required', Rule::in(Exam::STATUSES)],
            'max_attempts' => ['required', 'integer', 'min:1', 'max:20'],
            'passing_score' => ['required', 'integer', 'min:0', 'max:100'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['exists:categories,id'],
        ]);
    }
}
