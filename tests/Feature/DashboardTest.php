<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected from dashboard to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users are redirected from dashboard to tasks index', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get('/dashboard')
        ->assertRedirect(route('tasks.index'));
});

test('authenticated users can visit the tasks index page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('tasks.index'))
        ->assertOk();
});
