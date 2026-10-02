<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Contest;
use App\Models\Exam;
use App\Models\Result;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResultController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $results = Result::query()
            ->with(['user:id,name', 'exam:id,name', 'contest:id,name,year'])
            ->whereHas('contest', fn ($q) => $q->forUser($user))
            ->when($request->filled('contest'), fn ($q) => $q->where('contest_id', $request->contest))
            ->when($request->filled('exam'), fn ($q) => $q->where('exam_id', $request->exam))
            ->when($request->filled('category'), fn ($q) => $q->whereIn('user_id', function ($sub) use ($request) {
                $sub->select('user_id')->from('contest_participants')
                    ->whereColumn('contest_participants.contest_id', 'results.contest_id')
                    ->where('category_id', $request->category);
            }))
            ->orderByDesc('score')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('results/index', [
            'results' => $results,
            'contests' => Contest::forUser($user)->orderByDesc('year')->get(['id', 'name', 'year']),
            'exams' => Exam::forUser($user)->orderBy('name')->get(['id', 'name', 'contest_id']),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => $request->only(['contest', 'exam', 'category']),
            'prefix' => $this->prefix($request),
        ]);
    }
}
