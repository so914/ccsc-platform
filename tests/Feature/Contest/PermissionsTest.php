<?php

test('challenger cannot reach admin or agent routes by url', function (string $url) {
    $challenger = makeUser('challenger');

    $this->actingAs($challenger)->get($url)->assertForbidden();
})->with(['/admin/users', '/admin/contests', '/admin/exams', '/admin/finalists', '/admin/settings', '/agent/exams', '/agent/results']);

test('participant cannot reach challenger, admin or agent routes', function (string $url) {
    $participant = makeUser('participant');

    $this->actingAs($participant)->get($url)->assertForbidden();
})->with(['/challenger/exams', '/challenger/results', '/admin/users', '/agent/exams']);

test('challenger cannot reach participant routes', function () {
    $this->actingAs(makeUser('challenger'))->get('/participant/workshops')->assertForbidden();
});

test('agent cannot reach system administration', function (string $url) {
    $agent = makeUser('agent');

    $this->actingAs($agent)->get($url)->assertForbidden();
})->with(['/admin/users', '/admin/roles', '/admin/permissions', '/admin/activity-logs', '/admin/settings', '/admin/contests/create', '/admin/categories', '/admin/finalists']);

test('guests are redirected to login', function (string $url) {
    $this->get($url)->assertRedirect('/login');
})->with(['/admin/contests', '/agent/exams', '/challenger/exams', '/participant/workshops']);

test('agent only sees contests and exams they are assigned to', function () {
    $agent = makeUser('agent');
    $mine = makeContest(['name' => 'Mon concours']);
    $mine->agents()->attach($agent);
    $other = makeContest(['name' => 'Autre concours']);
    $myExam = makeExam($mine);
    $otherExam = makeExam($other, ['name' => 'Examen caché']);

    $this->actingAs($agent)->get('/agent/contests')->assertOk()
        ->assertInertia(fn ($page) => $page->has('contests.data', 1)->where('contests.data.0.name', 'Mon concours'));
    $this->actingAs($agent)->get('/agent/exams')->assertInertia(fn ($page) => $page->has('exams.data', 1));
    $this->actingAs($agent)->get("/agent/exams/{$myExam->id}")->assertOk();
    $this->actingAs($agent)->get("/agent/exams/{$otherExam->id}")->assertForbidden();
    $this->actingAs($agent)->get("/agent/contests/{$other->id}")->assertForbidden();
});

test('agent can create an exam only in an assigned contest', function () {
    $agent = makeUser('agent');
    $mine = makeContest(['name' => 'Mon concours']);
    $mine->agents()->attach($agent);
    $other = makeContest(['name' => 'Autre concours']);
    $payload = ['name' => 'Linux', 'duration_minutes' => 45, 'status' => 'draft', 'max_attempts' => 1, 'passing_score' => 50];

    $this->actingAs($agent)->post('/agent/exams', [...$payload, 'contest_id' => $mine->id])->assertRedirect();
    $this->actingAs($agent)->post('/agent/exams', [...$payload, 'contest_id' => $other->id])->assertForbidden();

    expect(App\Models\Exam::count())->toBe(1);
});

test('agent cannot edit the composition of a foreign exam', function () {
    $agent = makeUser('agent');
    $other = makeContest();
    $exam = makeExam($other);

    $this->actingAs($agent)->put("/agent/exams/{$exam->id}/challenges", ['challenges' => []])->assertForbidden();
    $this->actingAs($agent)->put("/agent/exams/{$exam->id}", ['contest_id' => $other->id, 'name' => 'x', 'duration_minutes' => 10, 'status' => 'draft', 'max_attempts' => 1, 'passing_score' => 50])->assertForbidden();
});

test('exam composition is frozen once attempts exist', function () {
    $admin = makeUser('admin');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    $user = makeUser('challenger');
    enroll($user, $contest);
    app(App\Services\AttemptService::class)->start($user, $exam);

    $this->actingAs($admin)->put("/admin/exams/{$exam->id}/challenges", ['challenges' => []])->assertSessionHasErrors('challenges');
    expect($exam->challenges()->count())->toBe(2);
});

test('a locked challenge cannot be rewritten', function () {
    $admin = makeUser('admin');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    $user = makeUser('challenger');
    enroll($user, $contest);
    app(App\Services\AttemptService::class)->start($user, $exam);
    $challenge = $exam->challenges()->where('answer_type', 'flag')->first();

    $this->actingAs($admin)->put("/admin/challenges/{$challenge->id}", [
        'question_bank_id' => $challenge->question_bank_id,
        'title' => 'Titre modifié',
        'points' => 9999,
        'difficulty' => 'hard',
        'answer_type' => 'flag',
        'expected_answer' => 'FLAG{changed}',
        'status' => 'active',
        'explanation' => 'Nouvelle explication',
    ])->assertRedirect();

    $fresh = $challenge->fresh();
    expect($fresh->expected_answer)->toBe('FLAG{ok}')
        ->and($fresh->points)->toBe(200)
        ->and($fresh->explanation)->toBe('Nouvelle explication');
});

test('challenger sees only their own results', function () {
    $mine = makeUser('challenger');
    $other = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    enroll($mine, $contest);
    enroll($other, $contest);
    $service = app(App\Services\AttemptService::class);
    $service->submit($service->start($mine, $exam));
    $service->submit($service->start($other, $exam));
    $foreign = App\Models\Result::where('user_id', $other->id)->first();

    $this->actingAs($mine)->get('/challenger/results')->assertInertia(fn ($page) => $page->has('results', 1));
    $this->actingAs($mine)->get("/challenger/results/{$foreign->id}")->assertForbidden();
});

test('corrections stay hidden until the exam is closed', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['status' => 'ongoing']);
    $exam = makeExam($contest);
    enroll($user, $contest);
    $service = app(App\Services\AttemptService::class);
    $service->submit($service->start($user, $exam));
    $result = App\Models\Result::first();

    $this->actingAs($user)->get("/challenger/results/{$result->id}")->assertInertia(fn ($page) => $page->where('corrections', null));

    $exam->update(['status' => 'closed']);
    $this->actingAs($user)->get("/challenger/results/{$result->id}")->assertInertia(fn ($page) => $page->has('corrections', 2));
});

test('a user with history cannot be deleted', function () {
    $admin = makeUser('admin');
    $user = makeUser('challenger');
    $contest = makeContest();
    enroll($user, $contest);

    $this->actingAs($admin)->delete("/admin/users/{$user->id}");

    expect(App\Models\User::find($user->id))->not->toBeNull();
});
