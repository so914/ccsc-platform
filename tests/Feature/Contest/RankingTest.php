<?php

use App\Models\Category;
use App\Models\Finalist;
use App\Models\Result;
use App\Services\RankingService;

function addResult($contest, $exam, $user, int $score, int $seconds, string $at = '2026-10-02 10:00:00'): void
{
    $attempt = App\Models\Attempt::create([
        'user_id' => $user->id, 'exam_id' => $exam->id, 'attempt_number' => 1,
        'started_at' => now(), 'expires_at' => now()->addHour(), 'status' => 'submitted', 'score' => $score,
    ]);

    Result::create([
        'contest_id' => $contest->id, 'exam_id' => $exam->id, 'user_id' => $user->id, 'attempt_id' => $attempt->id,
        'score' => $score, 'max_score' => 300, 'percentage' => $score / 3, 'status' => 'passed', 'qualified' => true,
        'duration_seconds' => $seconds, 'submitted_at' => $at, 'computed_at' => now(),
    ]);
}

test('ranking orders by score then by time used', function () {
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    [$a, $b, $c] = [makeUser('challenger'), makeUser('challenger'), makeUser('challenger')];
    foreach ([$a, $b, $c] as $user) {
        enroll($user, $contest);
    }

    addResult($contest, $exam, $a, 200, 600);
    addResult($contest, $exam, $b, 300, 900);
    addResult($contest, $exam, $c, 200, 300);

    $ranking = app(RankingService::class)->ranking($contest);

    expect($ranking->pluck('user_id')->all())->toBe([$b->id, $c->id, $a->id])
        ->and($ranking->pluck('rank')->all())->toBe([1, 2, 3]);
});

test('perfect ties share the same rank', function () {
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    [$a, $b, $c] = [makeUser('challenger'), makeUser('challenger'), makeUser('challenger')];
    foreach ([$a, $b, $c] as $user) {
        enroll($user, $contest);
    }

    addResult($contest, $exam, $a, 300, 600);
    addResult($contest, $exam, $b, 300, 600);
    addResult($contest, $exam, $c, 100, 100);

    expect(app(RankingService::class)->ranking($contest)->pluck('rank')->all())->toBe([1, 1, 3]);
});

test('tie breakers are configurable per contest', function () {
    $contest = makeContest(['status' => 'ongoing', 'tie_breakers' => ['score_desc', 'submitted_at_asc']]);
    $exam = makeExam($contest);
    [$a, $b] = [makeUser('challenger'), makeUser('challenger')];
    foreach ([$a, $b] as $user) {
        enroll($user, $contest);
    }

    addResult($contest, $exam, $a, 200, 100, '2026-10-02 12:00:00');
    addResult($contest, $exam, $b, 200, 900, '2026-10-02 09:00:00');

    expect(app(RankingService::class)->ranking($contest)->first()->user_id)->toBe($b->id);
});

test('ranking can be filtered by category and by exam', function () {
    $contest = makeContest(['status' => 'ongoing']);
    $examOne = makeExam($contest);
    $junior = Category::create(['name' => 'Junior']);
    $senior = Category::create(['name' => 'Senior']);
    [$a, $b] = [makeUser('challenger'), makeUser('challenger')];
    enroll($a, $contest, $junior);
    enroll($b, $contest, $senior);
    addResult($contest, $examOne, $a, 100, 100);
    addResult($contest, $examOne, $b, 200, 100);

    $service = app(RankingService::class);

    expect($service->ranking($contest, $junior))->toHaveCount(1)
        ->and($service->ranking($contest, $junior)->first()->user_id)->toBe($a->id)
        ->and($service->ranking($contest, null, $examOne))->toHaveCount(2);
});

test('withdrawn registrations are excluded from the ranking', function () {
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    $user = makeUser('challenger');
    enroll($user, $contest)->update(['status' => 'withdrawn']);
    addResult($contest, $exam, $user, 300, 100);

    expect(app(RankingService::class)->ranking($contest))->toHaveCount(0);
});

test('qualification stores finalists linked to the contest', function () {
    $contest = makeContest(['status' => 'finished']);
    $exam = makeExam($contest);
    [$a, $b, $c] = [makeUser('challenger'), makeUser('challenger'), makeUser('challenger')];
    foreach ([$a, $b, $c] as $user) {
        enroll($user, $contest);
    }
    addResult($contest, $exam, $a, 300, 100);
    addResult($contest, $exam, $b, 200, 100);
    addResult($contest, $exam, $c, 100, 100);

    $created = app(RankingService::class)->qualify($contest, 2);

    expect($created)->toBe(2)
        ->and(Finalist::where('contest_id', $contest->id)->count())->toBe(2)
        ->and(Finalist::where('user_id', $c->id)->exists())->toBeFalse();
});

test('requalifying does not duplicate finalists nor erase final positions', function () {
    $contest = makeContest(['status' => 'finished']);
    $exam = makeExam($contest);
    $user = makeUser('challenger');
    enroll($user, $contest);
    addResult($contest, $exam, $user, 300, 100);
    $service = app(RankingService::class);

    $service->qualify($contest, 5);
    Finalist::first()->update(['final_position' => 1]);
    $service->qualify($contest, 5);

    expect(Finalist::count())->toBe(1)
        ->and(Finalist::first()->final_position)->toBe(1);
});

test('admin can qualify and record winners through the interface routes', function () {
    $admin = makeUser('admin');
    $contest = makeContest(['status' => 'finished']);
    $exam = makeExam($contest);
    $user = makeUser('challenger');
    enroll($user, $contest);
    addResult($contest, $exam, $user, 300, 100);

    $this->actingAs($admin)->post('/admin/finalists/qualify', ['contest_id' => $contest->id, 'count' => 3])->assertRedirect();
    $finalist = Finalist::first();
    $this->actingAs($admin)->put("/admin/finalists/{$finalist->id}", ['status' => 'confirmed', 'final_position' => 1])->assertRedirect();

    $this->actingAs($admin)->get('/admin/winners?contest='.$contest->id)->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/winners/index')->has('finalists', 1));
});

test('a past edition stays intact when a new edition is created', function () {
    $old = makeContest(['year' => 2026, 'status' => 'archived']);
    $exam = makeExam($old);
    $user = makeUser('challenger');
    enroll($user, $old);
    addResult($old, $exam, $user, 300, 100);

    makeContest(['year' => 2027]);

    expect(Result::where('contest_id', $old->id)->count())->toBe(1)
        ->and(app(RankingService::class)->ranking($old))->toHaveCount(1);
});
