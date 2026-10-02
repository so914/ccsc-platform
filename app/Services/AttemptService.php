<?php

namespace App\Services;

use App\Models\Attempt;
use App\Models\Challenge;
use App\Models\ContestParticipant;
use App\Models\Exam;
use App\Models\Result;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AttemptService
{
    public function participation(User $user, Exam $exam): ?ContestParticipant
    {
        return ContestParticipant::where('user_id', $user->id)
            ->where('contest_id', $exam->contest_id)
            ->where('status', 'registered')
            ->first();
    }

    public function canAccess(User $user, Exam $exam): bool
    {
        $participation = $this->participation($user, $exam);

        if (! $participation) {
            return false;
        }

        $allowed = $exam->categories()->pluck('categories.id');

        return $allowed->isEmpty() || $allowed->contains($participation->category_id);
    }

    public function start(User $user, Exam $exam): Attempt
    {
        if (! $this->canAccess($user, $exam)) {
            throw ValidationException::withMessages(['exam' => 'Vous n\'avez pas accès à cet examen.']);
        }

        if (! $exam->isAvailable()) {
            throw ValidationException::withMessages(['exam' => 'Cet examen n\'est pas disponible actuellement.']);
        }

        return DB::transaction(function () use ($user, $exam) {
            $current = Attempt::where('user_id', $user->id)
                ->where('exam_id', $exam->id)
                ->where('status', 'in_progress')
                ->lockForUpdate()
                ->first();

            if ($current) {
                if (! $current->hasExpired()) {
                    return $current;
                }

                $this->finalize($current);
            }

            $count = Attempt::where('user_id', $user->id)->where('exam_id', $exam->id)->count();

            if ($count >= $exam->max_attempts) {
                throw ValidationException::withMessages(['exam' => 'Nombre maximal de tentatives atteint.']);
            }

            if ($exam->challenges()->count() === 0) {
                throw ValidationException::withMessages(['exam' => 'Cet examen ne contient aucun challenge.']);
            }

            $startedAt = now();
            $expiresAt = $startedAt->copy()->addMinutes($exam->duration_minutes);

            if ($exam->end_at && $exam->end_at < $expiresAt) {
                $expiresAt = $exam->end_at->copy();
            }

            return Attempt::create([
                'user_id' => $user->id,
                'exam_id' => $exam->id,
                'attempt_number' => $count + 1,
                'started_at' => $startedAt,
                'expires_at' => $expiresAt,
                'status' => 'in_progress',
            ]);
        });
    }

    public function saveAnswers(Attempt $attempt, array $answers): void
    {
        if (! $attempt->isInProgress() || $attempt->hasExpired()) {
            return;
        }

        $allowed = $attempt->exam->challenges()->pluck('challenges.id')->all();

        foreach ($answers as $challengeId => $answer) {
            if (! in_array((int) $challengeId, $allowed, true)) {
                continue;
            }

            Submission::updateOrCreate(
                ['attempt_id' => $attempt->id, 'challenge_id' => (int) $challengeId],
                [
                    'user_id' => $attempt->user_id,
                    'exam_id' => $attempt->exam_id,
                    'answer' => $answer,
                    'submitted_at' => now(),
                ]
            );
        }
    }

    public function submit(Attempt $attempt, array $answers = []): Attempt
    {
        if (! $attempt->isInProgress()) {
            return $attempt;
        }

        $this->saveAnswers($attempt, $answers);

        return $this->finalize($attempt);
    }

    public function finalize(Attempt $attempt): Attempt
    {
        return DB::transaction(function () use ($attempt) {
            $attempt = Attempt::whereKey($attempt->id)->lockForUpdate()->first();

            if ($attempt->status !== 'in_progress') {
                return $attempt;
            }

            $exam = $attempt->exam()->with('challenges.options')->first();
            $expired = $attempt->hasExpired();
            $finishedAt = $expired ? $attempt->expires_at : now();
            $score = 0;

            foreach ($attempt->submissions()->get() as $submission) {
                $challenge = $exam->challenges->firstWhere('id', $submission->challenge_id);

                if (! $challenge) {
                    continue;
                }

                $correct = $this->isCorrect($challenge, $submission->answer);
                $points = $correct ? (int) ($challenge->pivot->points ?? $challenge->points) : 0;
                $submission->update(['is_correct' => $correct, 'points_awarded' => $points]);
                $score += $points;
            }

            $attempt->update([
                'score' => $score,
                'status' => $expired ? 'expired' : 'submitted',
                'submitted_at' => $finishedAt,
            ]);

            $this->refreshResult($exam, $attempt->user_id);

            return $attempt->refresh();
        });
    }

    public function isCorrect(Challenge $challenge, mixed $answer): bool
    {
        if ($answer === null || $answer === '' || $answer === []) {
            return false;
        }

        if ($challenge->answer_type === 'single_choice') {
            return $challenge->options->contains(fn ($o) => $o->is_correct && $o->id === (int) $answer);
        }

        if ($challenge->answer_type === 'multiple_choice') {
            $given = collect((array) $answer)->map(fn ($v) => (int) $v)->unique()->sort()->values()->all();
            $expected = $challenge->options->where('is_correct', true)->pluck('id')->sort()->values()->all();

            return $given === $expected && $expected !== [];
        }

        $given = trim((string) $answer);

        if ($challenge->answer_type === 'flag') {
            return hash_equals(trim((string) $challenge->expected_answer), $given);
        }

        $accepted = array_map(fn ($v) => mb_strtolower(trim($v)), explode('|', (string) $challenge->expected_answer));

        return in_array(mb_strtolower($given), $accepted, true);
    }

    public function refreshResult(Exam $exam, int $userId): ?Result
    {
        $best = Attempt::where('user_id', $userId)
            ->where('exam_id', $exam->id)
            ->whereIn('status', ['submitted', 'expired'])
            ->orderByDesc('score')
            ->orderBy('submitted_at')
            ->first();

        if (! $best) {
            return null;
        }

        $maxScore = $exam->maxScore();
        $percentage = $maxScore > 0 ? round($best->score / $maxScore * 100, 2) : 0;
        $passed = $percentage >= $exam->passing_score;

        return Result::updateOrCreate(
            ['exam_id' => $exam->id, 'user_id' => $userId],
            [
                'contest_id' => $exam->contest_id,
                'attempt_id' => $best->id,
                'score' => $best->score,
                'max_score' => $maxScore,
                'percentage' => $percentage,
                'status' => $passed ? 'passed' : 'failed',
                'qualified' => $passed,
                'duration_seconds' => max(0, $best->submitted_at->diffInSeconds($best->started_at, true)),
                'submitted_at' => $best->submitted_at,
                'computed_at' => now(),
            ]
        );
    }
}
