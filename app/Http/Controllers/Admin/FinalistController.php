<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contest;
use App\Models\Finalist;
use App\Services\RankingService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FinalistController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('admin/finalists/index', $this->props($request, false));
    }

    public function winners(Request $request)
    {
        return Inertia::render('admin/winners/index', $this->props($request, true));
    }

    public function qualify(Request $request, RankingService $service)
    {
        $data = $request->validate([
            'contest_id' => ['required', 'exists:contests,id'],
            'count' => ['required', 'integer', 'min:1', 'max:1000'],
            'category_id' => ['nullable', 'exists:categories,id'],
        ]);

        $contest = Contest::findOrFail($data['contest_id']);
        $category = isset($data['category_id']) ? $contest->categories()->find($data['category_id']) : null;
        $created = $service->qualify($contest, (int) $data['count'], $category);

        return back()->with('success', "{$created} finaliste(s) ajouté(s).");
    }

    public function update(Request $request, Finalist $finalist)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(Finalist::STATUSES)],
            'final_position' => ['nullable', 'integer', 'min:1', 'max:1000'],
        ]);

        $finalist->update($data);

        return back()->with('success', 'Finaliste mis à jour.');
    }

    private function props(Request $request, bool $winnersOnly): array
    {
        $contests = Contest::orderByDesc('year')->get(['id', 'name', 'year']);
        $contestId = $request->input('contest', $contests->first()?->id);

        $finalists = Finalist::query()
            ->with(['user:id,name,email', 'category:id,name'])
            ->where('contest_id', $contestId)
            ->when($winnersOnly, fn ($q) => $q->whereNotNull('final_position')->orderBy('final_position'))
            ->when(! $winnersOnly, fn ($q) => $q->orderBy('category_id')->orderBy('preselection_rank'))
            ->get();

        return [
            'finalists' => $finalists,
            'contests' => $contests,
            'contest' => $contests->firstWhere('id', (int) $contestId),
            'categories' => $contestId ? Contest::find($contestId)?->categories()->get(['categories.id', 'categories.name']) : [],
            'statuses' => Finalist::STATUSES,
        ];
    }
}
