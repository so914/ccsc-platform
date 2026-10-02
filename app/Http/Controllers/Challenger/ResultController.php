<?php

namespace App\Http\Controllers\Challenger;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Result;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResultController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $results = Result::with(['exam:id,name,status', 'contest:id,name,year'])
            ->where('user_id', $user->id)
            ->orderByDesc('submitted_at')
            ->get();

        $attempts = Attempt::with('exam:id,name')
            ->where('user_id', $user->id)
            ->whereIn('status', ['submitted', 'expired'])
            ->orderByDesc('submitted_at')
            ->get(['id', 'exam_id', 'attempt_number', 'started_at', 'submitted_at', 'score', 'status']);

        return Inertia::render('challenger/results/index', [
            'results' => $results,
            'attempts' => $attempts,
        ]);
    }

    public function show(Request $request, Result $result)
    {
        abort_unless($result->user_id === $request->user()->id, 403);

        $result->load(['exam:id,name,status', 'contest:id,name,year']);
        $corrections = null;

        if (in_array($result->exam->status, ['closed', 'archived'], true)) {
            $submissions = $result->attempt->submissions()->get()->keyBy('challenge_id');
            $corrections = $result->exam->challenges()->get()->map(fn ($challenge) => [
                'title' => $challenge->title,
                'is_correct' => (bool) $submissions->get($challenge->id)?->is_correct,
                'points_awarded' => (int) ($submissions->get($challenge->id)?->points_awarded ?? 0),
                'explanation' => $challenge->explanation,
            ])->values();
        }

        return Inertia::render('challenger/results/show', ['result' => $result, 'corrections' => $corrections]);
    }
}
