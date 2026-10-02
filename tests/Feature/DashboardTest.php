<?php

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('admin sees the admin dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole('admin');

    $this->actingAs($user)->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboards/admin')->has('stats')->has('recentActivities'));
});

test('agent sees the agent dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole('agent');

    $this->actingAs($user)->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboards/agent')->has('stats'));
});

test('challenger sees the challenger dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole('challenger');

    $this->actingAs($user)->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboards/challenger')->has('stats'));
});

test('participant sees the participant dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole('participant');

    $this->actingAs($user)->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboards/participant')->has('stats'));
});

test('admin dashboard counts challengers', function () {
    User::factory()->count(3)->create()->each->assignRole('challenger');
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $this->actingAs($admin)->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page->where('stats.challengers', 3));
});
