<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleLoginController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('auth/google', [GoogleLoginController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [GoogleLoginController::class, 'handleGoogleCallback'])->name('auth.google.callback');


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
