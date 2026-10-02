<?php

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind a different classes or traits.
|
*/

pest()->extend(Tests\TestCase::class)
    ->use(Illuminate\Foundation\Testing\RefreshDatabase::class)
    ->in('Feature');

/*
|--------------------------------------------------------------------------
| Expectations
|--------------------------------------------------------------------------
|
| When you're writing tests, you often need to check that values meet certain conditions. The
| "expect()" function gives you access to a set of "expectations" methods that you can use
| to assert different things. Of course, you may extend the Expectation API at any time.
|
*/

expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

/*
|--------------------------------------------------------------------------
| Functions
|--------------------------------------------------------------------------
|
| While Pest is very powerful out-of-the-box, you may have some testing code specific to your
| project that you don't want to repeat in every file. Here you can also expose helpers as
| global functions to help you to reduce the number of lines of code in your test files.
|
*/

function something()
{
    // ..
}

function makeUser(string $role): App\Models\User
{
    test()->seed(Database\Seeders\RolesAndPermissionsSeeder::class);
    $user = App\Models\User::factory()->create();
    $user->assignRole($role);

    return $user;
}

function makeContest(array $attributes = []): App\Models\Contest
{
    return App\Models\Contest::create([
        'name' => 'Cyber Challenge Congo',
        'year' => 2026,
        'status' => 'registration',
        'registration_start_at' => now()->subDay(),
        'registration_end_at' => now()->addWeek(),
        ...$attributes,
    ]);
}

function makeExam(App\Models\Contest $contest, array $attributes = []): App\Models\Exam
{
    $bank = App\Models\QuestionBank::firstOrCreate(['name' => 'Banque test']);

    $single = App\Models\Challenge::create(['question_bank_id' => $bank->id, 'title' => 'QCM', 'points' => 100, 'answer_type' => 'single_choice']);
    $single->options()->createMany([
        ['content' => 'Mauvaise', 'is_correct' => false, 'position' => 0],
        ['content' => 'Bonne', 'is_correct' => true, 'position' => 1],
    ]);

    $flag = App\Models\Challenge::create(['question_bank_id' => $bank->id, 'title' => 'Flag', 'points' => 200, 'answer_type' => 'flag', 'expected_answer' => 'FLAG{ok}']);

    $exam = App\Models\Exam::create([
        'contest_id' => $contest->id,
        'name' => 'Présélection générale',
        'duration_minutes' => 30,
        'status' => 'open',
        'max_attempts' => 2,
        'passing_score' => 50,
        ...$attributes,
    ]);
    $exam->challenges()->attach([$single->id => ['position' => 0], $flag->id => ['position' => 1]]);

    return $exam;
}

function enroll(App\Models\User $user, App\Models\Contest $contest, ?App\Models\Category $category = null): App\Models\ContestParticipant
{
    $category ??= App\Models\Category::firstOrCreate(['name' => 'Junior']);
    $contest->categories()->syncWithoutDetaching([$category->id]);

    return App\Models\ContestParticipant::create([
        'user_id' => $user->id,
        'contest_id' => $contest->id,
        'category_id' => $category->id,
        'status' => 'registered',
        'registered_at' => now(),
    ]);
}
