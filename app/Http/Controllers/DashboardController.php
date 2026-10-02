<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\Contest;
use App\Models\Exam;
use App\Models\Finalist;
use App\Models\Result;
use App\Models\Submission;
use App\Models\User;
use App\Models\Workshop;
use App\Models\WorkshopRegistration;
use App\Services\RankingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return match (true) {
            $user->hasRole('admin') => $this->admin(),
            $user->hasRole('agent') => $this->agent($user),
            $user->hasRole('challenger') => $this->challenger($user),
            default => $this->participant($user),
        };
    }

    private function currentContest(): ?Contest
    {
        return Contest::whereIn('status', ['registration', 'ongoing'])->orderByDesc('year')->first()
            ?? Contest::where('status', '!=', 'archived')->orderByDesc('year')->first();
    }

    private function admin(): Response
    {
        $contest = $this->currentContest();

        $activities = Activity::with('causer')->latest()->take(5)->get()->map(fn ($a) => [
            'id' => $a->id,
            'description' => $a->description,
            'subject_type' => $a->subject_type ? class_basename($a->subject_type) : null,
            'causer_name' => $a->causer?->name ?? 'Système',
            'created_at' => $a->created_at->diffForHumans(),
        ]);

        return Inertia::render('dashboards/admin', [
            'contest' => $contest?->only(['id', 'name', 'year', 'status']),
            'stats' => [
                'challengers' => User::role('challenger')->count(),
                'participants' => User::role('participant')->count(),
                'agents' => User::role('agent')->count(),
                'active_exams' => Exam::whereIn('status', ['scheduled', 'open'])->count(),
                'finished_exams' => Exam::whereIn('status', ['closed', 'archived'])->count(),
                'submissions' => Submission::count(),
                'qualified' => $contest ? Result::where('contest_id', $contest->id)->where('qualified', true)->distinct('user_id')->count('user_id') : 0,
                'finalists' => $contest ? Finalist::where('contest_id', $contest->id)->count() : 0,
            ],
            'nextExam' => Exam::with('contest:id,name')->where('start_at', '>', now())->whereIn('status', ['scheduled', 'open'])->orderBy('start_at')->first(['id', 'name', 'start_at', 'contest_id']),
            'recentActivities' => $activities,
        ]);
    }

    private function agent(User $user): Response
    {
        $contestIds = Contest::forUser($user)->pluck('id');
        $examIds = Exam::whereIn('contest_id', $contestIds)->pluck('id');

        return Inertia::render('dashboards/agent', [
            'contests' => Contest::forUser($user)->orderByDesc('year')->get(['id', 'name', 'year', 'status']),
            'stats' => [
                'exams' => $examIds->count(),
                'challenges' => Challenge::count(),
                'submissions' => Submission::whereIn('exam_id', $examIds)->count(),
                'results' => Result::whereIn('exam_id', $examIds)->count(),
            ],
            'exams' => Exam::whereIn('id', $examIds)->with('contest:id,name')->latest()->take(5)->get(['id', 'name', 'status', 'contest_id', 'start_at']),
        ]);
    }

    private function challenger(User $user): Response
    {
        $participation = $user->participations()->where('status', 'registered')
            ->with(['contest:id,name,year,status', 'category:id,name'])
            ->latest('registered_at')->first();

        $data = [
            'participation' => $participation,
            'stats' => ['available_exams' => 0, 'finished_exams' => 0, 'score' => 0, 'rank' => null],
            'deadlines' => [],
        ];

        if ($participation) {
            $exams = Exam::where('contest_id', $participation->contest_id)
                ->whereIn('status', ['scheduled', 'open', 'closed'])
                ->where(fn ($q) => $q->whereDoesntHave('categories')->orWhereHas('categories', fn ($c) => $c->where('categories.id', $participation->category_id)))
                ->get();

            $available = $exams->filter(fn ($e) => $e->isAvailable());
            $data['stats'] = [
                'available_exams' => $available->count(),
                'finished_exams' => Result::where('user_id', $user->id)->where('contest_id', $participation->contest_id)->count(),
                'score' => (int) Result::where('user_id', $user->id)->where('contest_id', $participation->contest_id)->sum('score'),
                'rank' => app(RankingService::class)->userPosition($participation->contest, $user->id)?->rank,
            ];
            $data['deadlines'] = $available->sortBy('end_at')->take(5)->map(fn ($e) => $e->only(['id', 'name', 'end_at']))->values();
        }

        return Inertia::render('dashboards/challenger', $data);
    }

    private function participant(User $user): Response
    {
        $registered = WorkshopRegistration::where('user_id', $user->id)->where('status', 'registered');

        return Inertia::render('dashboards/participant', [
            'upcoming' => Workshop::whereIn('id', (clone $registered)->pluck('workshop_id'))
                ->where('starts_at', '>=', now())->orderBy('starts_at')->take(5)
                ->get(['id', 'title', 'starts_at', 'speaker_name']),
            'stats' => [
                'followed' => Workshop::whereIn('id', (clone $registered)->pluck('workshop_id'))->where('starts_at', '<', now())->count(),
                'registered' => (clone $registered)->count(),
                'available' => Workshop::where('status', 'published')->where('starts_at', '>=', now())->count(),
            ],
        ]);
    }
}
