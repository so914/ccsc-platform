<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\QuestionBank;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionBankController extends Controller
{
    public function index(Request $request)
    {
        $banks = QuestionBank::query()
            ->withCount('challenges')
            ->when($request->filled('search'), fn ($q) => $q->where('name', 'like', "%{$request->search}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('question-banks/index', [
            'banks' => $banks,
            'filters' => $request->only('search'),
            'prefix' => $this->prefix($request),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('question-banks/form', ['bank' => null, 'prefix' => $this->prefix($request)]);
    }

    public function store(Request $request)
    {
        $bank = QuestionBank::create([...$this->validated($request), 'created_by' => $request->user()->id]);

        return redirect()->route($this->prefix($request).'.question-banks.show', $bank)->with('success', 'Banque créée.');
    }

    public function show(Request $request, QuestionBank $questionBank)
    {
        return Inertia::render('question-banks/show', [
            'bank' => $questionBank->load('challenges'),
            'prefix' => $this->prefix($request),
        ]);
    }

    public function edit(Request $request, QuestionBank $questionBank)
    {
        return Inertia::render('question-banks/form', ['bank' => $questionBank, 'prefix' => $this->prefix($request)]);
    }

    public function update(Request $request, QuestionBank $questionBank)
    {
        $questionBank->update($this->validated($request));

        return redirect()->route($this->prefix($request).'.question-banks.show', $questionBank)->with('success', 'Banque mise à jour.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);
    }
}
