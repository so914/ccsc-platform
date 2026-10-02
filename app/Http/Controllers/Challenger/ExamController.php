<?php

namespace App\Http\Controllers\Challenger;

use App\Http\Controllers\Controller;
use App\Models\Attempt;
use App\Models\Exam;
use App\Services\AttemptService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function index(Request $request, AttemptService $service)
    {
        $user = $request->user();

        $exams = Exam::query()
            ->with('contest:id,name,year')
            ->withCount('challenges')
            ->whereIn('status', ['scheduled', 'open', 'closed'])
            ->whereIn('contest_id', $user->participations()->where('status', 'registered')->pluck('contest_id'))
            ->orderBy('start_at')
            ->get()
            ->filter(fn ($exam) => $service->canAccess($user, $exam))
            ->values();

        $attempts = Attempt::where('user_id', $user->id)->whereIn('exam_id', $exams->pluck('id'))->get()->groupBy('exam_id');

        $rows = $exams->map(function ($exam) use ($attempts) {
            $own = $attempts->get($exam->id, collect());
            $inProgress = $own->firstWhere('status', 'in_progress');
            $remaining = max(0, $exam->max_attempts - $own->count());

            return [
                ...$exam->only(['id', 'name', 'description', 'duration_minutes', 'start_at', 'end_at', 'status', 'max_attempts', 'passing_score', 'challenges_count']),
                'contest' => $exam->contest,
                'attempts_used' => $own->count(),
                'in_progress' => (bool) ($inProgress && ! $inProgress->hasExpired()),
                'available' => $exam->isAvailable() && ($remaining > 0 || ($inProgress && ! $inProgress->hasExpired())),
                'finished' => ! $exam->isAvailable() || ($remaining === 0 && ! $inProgress),
            ];
        });

        return Inertia::render('challenger/exams/index', [
            'available' => $rows->where('finished', false)->values(),
            'finished' => $rows->where('finished', true)->values(),
        ]);
    }

    public function show(Request $request, Exam $exam, AttemptService $service)
    {
        $user = $request->user();
        abort_unless($service->canAccess($user, $exam), 403);

        $inProgress = Attempt::where('user_id', $user->id)->where('exam_id', $exam->id)->where('status', 'in_progress')->first();

        if ($inProgress && $inProgress->hasExpired()) {
            $service->finalize($inProgress);
            $inProgress = null;
        }

        $attempts = Attempt::where('user_id', $user->id)->where('exam_id', $exam->id)->orderBy('attempt_number')->get();
        $session = null;

        if ($inProgress) {
            $answers = $inProgress->submissions()->pluck('answer', 'challenge_id');
            $session = [
                'id' => $inProgress->id,
                'expires_at' => $inProgress->expires_at,
                'seconds_left' => max(0, (int) now()->diffInSeconds($inProgress->expires_at, false)),
                'answers' => $answers,
                'challenges' => $exam->challenges()->with('options')->get()->map(fn ($challenge) => [
                    'id' => $challenge->id,
                    'title' => $challenge->title,
                    'description' => $challenge->description,
                    'topic' => $challenge->topic,
                    'difficulty' => $challenge->difficulty,
                    'answer_type' => $challenge->answer_type,
                    'points' => $exam->challengePoints($challenge),
                    'options' => $challenge->hasChoices() ? $challenge->options->map(fn ($o) => ['id' => $o->id, 'content' => $o->content])->values() : [],
                ])->values(),
            ];
        }

        $used = $attempts->count();

        return Inertia::render('challenger/exams/show', [
            'exam' => [
                ...$exam->only(['id', 'name', 'description', 'duration_minutes', 'start_at', 'end_at', 'status', 'max_attempts', 'passing_score']),
                'challenges_count' => $exam->challenges()->count(),
                'max_score' => $exam->maxScore(),
                'available' => $exam->isAvailable(),
            ],
            'attempts' => $attempts->map(fn ($a) => $a->only(['id', 'attempt_number', 'started_at', 'submitted_at', 'score', 'status']))->values(),
            'canStart' => $exam->isAvailable() && ! $session && $used < $exam->max_attempts,
            'session' => $session,
        ]);
    }

    public function start(Request $request, Exam $exam, AttemptService $service)
    {
        $service->start($request->user(), $exam);

        return redirect()->route('challenger.exams.show', $exam);
    }

    public function save(Request $request, Attempt $attempt, AttemptService $service)
    {
        Gate::authorize('update', $attempt);
        $data = $request->validate(['answers' => ['array']]);
        $service->saveAnswers($attempt, $data['answers'] ?? []);

        return back();
    }

    public function submit(Request $request, Attempt $attempt, AttemptService $service)
    {
        Gate::authorize('update', $attempt);
        $data = $request->validate(['answers' => ['array']]);
        $service->submit($attempt, $data['answers'] ?? []);

        return redirect()->route('challenger.results.index')->with('success', 'Réponses soumises.');
    }
}
