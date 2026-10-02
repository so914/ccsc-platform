<?php

use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
    expect(User::where('email', 'test@example.com')->first()->hasRole('challenger'))->toBeTrue();
});

test('new users can register as participant', function () {
    $this->post(route('register.store'), [
        'name' => 'Atelier User',
        'email' => 'atelier@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'account_type' => 'participant',
    ]);

    expect(User::where('email', 'atelier@example.com')->first()->hasRole('participant'))->toBeTrue();
});

test('nobody can register as admin or agent', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Sneaky',
        'email' => 'sneaky@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'account_type' => 'admin',
    ]);

    $response->assertSessionHasErrors('account_type');
    $this->assertDatabaseMissing('users', ['email' => 'sneaky@example.com']);
});
