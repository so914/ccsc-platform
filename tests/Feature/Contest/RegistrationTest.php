<?php

use App\Models\Category;
use App\Models\ContestParticipant;

test('challenger registers to an open contest with an accepted category', function () {
    $user = makeUser('challenger');
    $contest = makeContest();
    $category = Category::create(['name' => 'Junior']);
    $contest->categories()->attach($category);

    $this->actingAs($user)->post("/challenger/contests/{$contest->id}/register", ['category_id' => $category->id])->assertRedirect();

    expect(ContestParticipant::where('user_id', $user->id)->where('contest_id', $contest->id)->first()->category_id)->toBe($category->id);
});

test('challenger cannot register twice to the same contest', function () {
    $user = makeUser('challenger');
    $contest = makeContest();
    $participation = enroll($user, $contest);

    $this->actingAs($user)->post("/challenger/contests/{$contest->id}/register", ['category_id' => $participation->category_id])
        ->assertSessionHasErrors('category_id');
});

test('challenger cannot register once registration is closed', function () {
    $user = makeUser('challenger');
    $contest = makeContest(['registration_end_at' => now()->subDay()]);
    $category = Category::create(['name' => 'Junior']);
    $contest->categories()->attach($category);

    $this->actingAs($user)->post("/challenger/contests/{$contest->id}/register", ['category_id' => $category->id])
        ->assertSessionHasErrors('category_id');
});

test('challenger cannot pick a category the contest does not accept', function () {
    $user = makeUser('challenger');
    $contest = makeContest();
    $other = Category::create(['name' => 'Senior']);

    $this->actingAs($user)->post("/challenger/contests/{$contest->id}/register", ['category_id' => $other->id])
        ->assertSessionHasErrors('category_id');
});

test('the same account can take part in several editions', function () {
    $user = makeUser('challenger');
    $first = makeContest(['year' => 2026]);
    $second = makeContest(['year' => 2027]);

    enroll($user, $first);
    enroll($user, $second);

    expect($user->participations()->count())->toBe(2);
});
