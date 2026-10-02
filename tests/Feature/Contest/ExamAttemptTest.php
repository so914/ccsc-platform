<?php

use App\Models\Attempt;
use App\Models\Category;
use App\Models\Result;
use App\Services\AttemptService;

function correctAnswers($exam): array
{
    $answers = [];
    foreach ($exam->challenges()->with('options')->get() as $challenge) {
        $answers[$challenge->id] = $challenge->answer_type === 'flag'
            ? 'FLAG{ok}'
            : $challenge->options->firstWhere('is_correct', true)->id;
    }

    return $answers;
}

test('enrolled challenger can start an exam and gets a server side deadline', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    enroll($user, $contest);

    $this->actingAs($user)->post("/challenger/exams/{$exam->id}/start")->assertRedirect("/challenger/exams/{$exam->id}");

    $attempt = Attempt::first();
    expect($attempt->status)->toBe('in_progress')
        ->and($attempt->started_at->diffInMinutes($attempt->expires_at))->toBe(30.0);
});

test('starting twice resumes the same attempt', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    enroll($user, $contest);

    $this->actingAs($user)->post("/challenger/exams/{$exam->id}/start");
    $this->actingAs($user)->post("/challenger/exams/{$exam->id}/start");

    expect(Attempt::count())->toBe(1);
});

test('challenger not enrolled cannot open or start the exam', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);

    $this->actingAs($user)->get("/challenger/exams/{$exam->id}")->assertForbidden();
    $this->actingAs($user)->post("/challenger/exams/{$exam->id}/start")->assertSessionHasErrors('exam');
    expect(Attempt::count())->toBe(0);
});

test('exam restricted to a category rejects other categories', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    $senior = Category::create(['name' => 'Senior']);
    $exam->categories()->attach($senior);
    enroll($user, $contest);

    $this->actingAs($user)->get("/challenger/exams/{$exam->id}")->assertForbidden();
});

test('closed exam cannot be started', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest, ['status' => 'closed']);
    enroll($user, $contest);

    $this->actingAs($user)->post("/challenger/exams/{$exam->id}/start")->assertSessionHasErrors('exam');
});

test('submission is graded automatically and a result is created', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    enroll($user, $contest);
    $attempt = app(AttemptService::class)->start($user, $exam);

    $this->actingAs($user)->post("/challenger/attempts/{$attempt->id}/submit", ['answers' => correctAnswers($exam)])->assertRedirect('/challenger/results');

    $result = Result::first();
    expect($attempt->fresh()->score)->toBe(300)
        ->and($attempt->fresh()->status)->toBe('submitted')
        ->and($result->score)->toBe(300)
        ->and($result->max_score)->toBe(300)
        ->and((float) $result->percentage)->toBe(100.0)
        ->and($result->qualified)->toBeTrue()
        ->and($attempt->submissions()->where('is_correct', true)->count())->toBe(2);
});

test('wrong and missing answers score zero', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    enroll($user, $contest);
    $attempt = app(AttemptService::class)->start($user, $exam);
    $flag = $exam->challenges()->where('answer_type', 'flag')->first();

    app(AttemptService::class)->submit($attempt, [$flag->id => 'FLAG{wrong}']);

    expect($attempt->fresh()->score)->toBe(0)
        ->and(Result::first()->status)->toBe('failed')
        ->and(Result::first()->qualified)->toBeFalse();
});

test('exam points override the challenge default', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    $flag = $exam->challenges()->where('answer_type', 'flag')->first();
    $exam->challenges()->updateExistingPivot($flag->id, ['points' => 500]);
    enroll($user, $contest);
    $attempt = app(AttemptService::class)->start($user, $exam->fresh());

    app(AttemptService::class)->submit($attempt, [$flag->id => 'FLAG{ok}']);

    expect($attempt->fresh()->score)->toBe(500);
});

test('an expired attempt is finalized with the saved answers only', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    enroll($user, $contest);
    $service = app(AttemptService::class);
    $attempt = $service->start($user, $exam);
    $flag = $exam->challenges()->where('answer_type', 'flag')->first();
    $service->saveAnswers($attempt, [$flag->id => 'FLAG{ok}']);

    $attempt->update(['expires_at' => now()->subMinute()]);
    $service->saveAnswers($attempt->fresh(), [$flag->id => 'FLAG{late}']);
    $service->finalize($attempt->fresh());

    expect($attempt->fresh()->status)->toBe('expired')
        ->and($attempt->fresh()->score)->toBe(200);
});

test('max attempts is enforced and every attempt is kept', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest, ['max_attempts' => 2]);
    enroll($user, $contest);
    $service = app(AttemptService::class);

    $service->submit($service->start($user, $exam));
    $service->submit($service->start($user, $exam));

    expect(fn () => $service->start($user, $exam))->toThrow(Illuminate\Validation\ValidationException::class);
    expect(Attempt::where('user_id', $user->id)->count())->toBe(2);
});

test('the result keeps the best attempt', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    enroll($user, $contest);
    $service = app(AttemptService::class);

    $service->submit($service->start($user, $exam), correctAnswers($exam));
    $service->submit($service->start($user, $exam), []);

    expect(Result::count())->toBe(1)
        ->and(Result::first()->score)->toBe(300);
});

test('a challenger cannot submit another challenger attempt', function () {
    $owner = makeUser('challenger');
    $other = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    enroll($owner, $contest);
    $attempt = app(AttemptService::class)->start($owner, $exam);

    $this->actingAs($other)->post("/challenger/attempts/{$attempt->id}/submit", ['answers' => []])->assertForbidden();
});

test('the exam page never leaks expected answers', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    enroll($user, $contest);
    app(AttemptService::class)->start($user, $exam);

    $response = $this->actingAs($user)->get("/challenger/exams/{$exam->id}")->assertOk();

    expect($response->getContent())->not->toContain('FLAG{ok}')->not->toContain('is_correct');
});

test('a challenge used by an exam with attempts becomes locked', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    enroll($user, $contest);
    $challenge = $exam->challenges()->first();

    expect($challenge->isLocked())->toBeFalse();
    app(AttemptService::class)->start($user, $exam);
    expect($challenge->fresh()->isLocked())->toBeTrue();
});
