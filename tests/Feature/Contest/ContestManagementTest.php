<?php

use App\Models\Category;
use App\Models\Contest;

test('admin can create a contest with categories and agents', function () {
    $admin = makeUser('admin');
    $agent = makeUser('agent');
    $category = Category::create(['name' => 'Junior']);

    $this->actingAs($admin)->post('/admin/contests', [
        'name' => 'Cyber Challenge Congo',
        'year' => 2026,
        'status' => 'draft',
        'category_ids' => [$category->id],
        'agent_ids' => [$agent->id],
    ])->assertRedirect();

    $contest = Contest::first();
    expect($contest->categories)->toHaveCount(1)
        ->and($contest->agents)->toHaveCount(1)
        ->and($contest->created_by)->toBe($admin->id);
});

test('two editions of the same contest can coexist', function () {
    $admin = makeUser('admin');

    makeContest(['year' => 2026]);
    $this->actingAs($admin)->post('/admin/contests', ['name' => 'Cyber Challenge Congo', 'year' => 2027, 'status' => 'draft'])->assertSessionHasNoErrors();
    $this->actingAs($admin)->post('/admin/contests', ['name' => 'Cyber Challenge Congo', 'year' => 2027, 'status' => 'draft'])->assertSessionHasErrors('year');

    expect(Contest::count())->toBe(2);
});

test('archiving a contest keeps its data', function () {
    $admin = makeUser('admin');
    $contest = makeContest();
    $exam = makeExam($contest);

    $this->actingAs($admin)->post("/admin/contests/{$contest->id}/archive")->assertRedirect();

    expect($contest->fresh()->status)->toBe('archived')
        ->and($exam->fresh())->not->toBeNull();
});

test('contests cannot be deleted through any route', function () {
    $admin = makeUser('admin');
    $contest = makeContest();

    $this->actingAs($admin)->delete("/admin/contests/{$contest->id}")->assertStatus(405);
    expect(Contest::count())->toBe(1);
});

test('admin can create a category and a workshop', function () {
    $admin = makeUser('admin');

    $this->actingAs($admin)->post('/admin/categories', ['name' => 'Senior', 'active' => true])->assertRedirect();
    $this->actingAs($admin)->post('/admin/workshops', [
        'title' => 'Introduction au forensics',
        'starts_at' => now()->addWeek()->toDateTimeString(),
        'duration_minutes' => 90,
        'capacity' => 20,
        'status' => 'published',
    ])->assertRedirect();

    expect(Category::where('name', 'Senior')->exists())->toBeTrue()
        ->and(App\Models\Workshop::count())->toBe(1);
});
