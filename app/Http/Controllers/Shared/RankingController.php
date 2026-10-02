<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Contest;
use App\Models\Exam;
use App\Services\RankingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class RankingController extends Controller
{
    public function index(Request $request, RankingService $service)
    {
        $user = $request->user();
        $contests = Contest::forUser($user)->orderByDesc('year')->get(['id', 'name', 'year']);
        $contest = $request->filled('contest')
            ? Contest::forUser($user)->find($request->contest)
            : Contest::forUser($user)->orderByDesc('year')->first();

        $ranking = [];
        $exams = [];
        $categories = [];

        if ($contest) {
            Gate::authorize('view', $contest);
            $category = $request->filled('category') ? Category::find($request->category) : null;
            $exam = $request->filled('exam') ? Exam::where('contest_id', $contest->id)->find($request->exam) : null;
            $ranking = $service->ranking($contest, $category, $exam)->values();
            $exams = $contest->exams()->orderBy('name')->get(['id', 'name']);
            $categories = $contest->categories()->orderBy('name')->get(['categories.id', 'categories.name']);
        }

        return Inertia::render('rankings/index', [
            'ranking' => $ranking,
            'contests' => $contests,
            'contest' => $contest?->only(['id', 'name', 'year', 'tie_breakers']),
            'exams' => $exams,
            'categories' => $categories,
            'filters' => $request->only(['contest', 'exam', 'category']),
            'prefix' => $this->prefix($request),
        ]);
    }
}
