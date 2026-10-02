<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Challenge;
use App\Models\QuestionBank;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ChallengeController extends Controller
{
    public function index(Request $request)
    {
        $challenges = Challenge::query()
            ->with('bank:id,name')
            ->when($request->filled('bank'), fn ($q) => $q->where('question_bank_id', $request->bank))
            ->when($request->filled('search'), fn ($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('challenges/index', [
            'challenges' => $challenges,
            'banks' => QuestionBank::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['search', 'bank']),
            'prefix' => $this->prefix($request),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('challenges/form', $this->formProps($request, null));
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $challenge = Challenge::create([...collect($data)->except('options')->all(), 'created_by' => $request->user()->id]);
        $this->syncOptions($challenge, $data['options'] ?? []);

        return redirect()->route($this->prefix($request).'.challenges.index')->with('success', 'Challenge créé.');
    }

    public function edit(Request $request, Challenge $challenge)
    {
        return Inertia::render('challenges/form', $this->formProps($request, $challenge->load('options')));
    }

    public function update(Request $request, Challenge $challenge)
    {
        $data = $this->validated($request);

        if ($challenge->isLocked()) {
            $challenge->update(['status' => $data['status'], 'explanation' => $data['explanation'] ?? null]);

            return redirect()->route($this->prefix($request).'.challenges.index')
                ->with('success', 'Challenge déjà utilisé dans un examen : seuls le statut et l\'explication ont été modifiés.');
        }

        $challenge->update(collect($data)->except('options')->all());
        $this->syncOptions($challenge, $data['options'] ?? []);

        return redirect()->route($this->prefix($request).'.challenges.index')->with('success', 'Challenge mis à jour.');
    }

    private function formProps(Request $request, ?Challenge $challenge): array
    {
        return [
            'challenge' => $challenge ? [...$challenge->toArray(), 'locked' => $challenge->isLocked()] : null,
            'banks' => QuestionBank::orderBy('name')->get(['id', 'name']),
            'answerTypes' => Challenge::ANSWER_TYPES,
            'difficulties' => Challenge::DIFFICULTIES,
            'statuses' => Challenge::STATUSES,
            'prefix' => $this->prefix($request),
        ];
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'question_bank_id' => ['required', 'exists:question_banks,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'topic' => ['nullable', 'string', 'max:100'],
            'difficulty' => ['required', Rule::in(Challenge::DIFFICULTIES)],
            'points' => ['required', 'integer', 'min:0', 'max:100000'],
            'answer_type' => ['required', Rule::in(Challenge::ANSWER_TYPES)],
            'expected_answer' => ['nullable', 'string'],
            'explanation' => ['nullable', 'string'],
            'status' => ['required', Rule::in(Challenge::STATUSES)],
            'options' => ['nullable', 'array'],
            'options.*.content' => ['required', 'string', 'max:255'],
            'options.*.is_correct' => ['boolean'],
        ]);

        if (in_array($data['answer_type'], ['single_choice', 'multiple_choice'], true)) {
            $options = collect($data['options'] ?? []);
            $correct = $options->where('is_correct', true)->count();

            if ($options->count() < 2) {
                throw ValidationException::withMessages(['options' => 'Au moins deux options sont requises.']);
            }

            if ($correct === 0 || ($data['answer_type'] === 'single_choice' && $correct !== 1)) {
                throw ValidationException::withMessages(['options' => 'Marquez la ou les bonnes réponses (une seule pour un choix unique).']);
            }

            $data['expected_answer'] = null;
        } else {
            if (blank($data['expected_answer'] ?? null)) {
                throw ValidationException::withMessages(['expected_answer' => 'La réponse attendue est requise.']);
            }

            $data['options'] = [];
        }

        return $data;
    }

    private function syncOptions(Challenge $challenge, array $options): void
    {
        $challenge->options()->delete();

        foreach (array_values($options) as $position => $option) {
            $challenge->options()->create([
                'content' => $option['content'],
                'is_correct' => (bool) ($option['is_correct'] ?? false),
                'position' => $position,
            ]);
        }
    }
}
