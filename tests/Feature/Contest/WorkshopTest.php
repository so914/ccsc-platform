<?php

use App\Models\Workshop;
use App\Models\WorkshopRegistration;

function makeWorkshop(array $attributes = []): Workshop
{
    return Workshop::create([
        'title' => 'Atelier Linux',
        'starts_at' => now()->addWeek(),
        'duration_minutes' => 60,
        'capacity' => 1,
        'status' => 'published',
        ...$attributes,
    ]);
}

test('participant registers to a published workshop', function () {
    $user = makeUser('participant');
    $workshop = makeWorkshop();

    $this->actingAs($user)->post("/participant/workshops/{$workshop->id}/register")->assertRedirect();

    expect(WorkshopRegistration::where('user_id', $user->id)->where('status', 'registered')->count())->toBe(1);
});

test('workshop capacity is enforced', function () {
    $workshop = makeWorkshop(['capacity' => 1]);
    $first = makeUser('participant');
    $second = makeUser('participant');

    $this->actingAs($first)->post("/participant/workshops/{$workshop->id}/register");
    $this->actingAs($second)->post("/participant/workshops/{$workshop->id}/register")->assertSessionHasErrors('workshop');

    expect(WorkshopRegistration::count())->toBe(1);
});

test('cancelling frees the seat and keeps the history row', function () {
    $workshop = makeWorkshop(['capacity' => 1]);
    $first = makeUser('participant');
    $second = makeUser('participant');

    $this->actingAs($first)->post("/participant/workshops/{$workshop->id}/register");
    $this->actingAs($first)->delete("/participant/workshops/{$workshop->id}/register");
    $this->actingAs($second)->post("/participant/workshops/{$workshop->id}/register")->assertSessionHasNoErrors();

    expect(WorkshopRegistration::where('user_id', $first->id)->first()->status)->toBe('cancelled');
});

test('draft workshops are not visible nor registrable', function () {
    $user = makeUser('participant');
    $workshop = makeWorkshop(['status' => 'draft']);

    $this->actingAs($user)->get('/participant/workshops')->assertInertia(fn ($page) => $page->has('workshops', 0));
    $this->actingAs($user)->post("/participant/workshops/{$workshop->id}/register")->assertForbidden();
});

test('participant dashboard lists upcoming registered workshops', function () {
    $user = makeUser('participant');
    $workshop = makeWorkshop();
    $this->actingAs($user)->post("/participant/workshops/{$workshop->id}/register");

    $this->actingAs($user)->get('/dashboard')->assertInertia(fn ($page) => $page->component('dashboards/participant')->has('upcoming', 1));
});
