<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleLoginController;
use Inertia\Inertia;

Route::get('/', function () {
    return Auth::check()
        ? redirect()->route('tasks.index')
        : Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return redirect()->route('tasks.index');
    })->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::post('/tasks', [TaskController::class, 'store'])->name('tasks.store');
    Route::get('/tasks/create', [TaskController::class, 'create'])->name('tasks.create');
    Route::get('/tasks/{task}/edit', [TaskController::class, 'edit'])->name('tasks.edit');
    Route::put('/tasks/{task}', [TaskController::class, 'update'])->name('tasks.update');
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->name('tasks.destroy');

    // For dashboard stats
    Route::get('/dashboard/task-stats', [TaskController::class, 'stats'])->name('dashboard.taskStats');
});


Route::get('auth/google', [GoogleLoginController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('auth/google/callback', [GoogleLoginController::class, 'handleGoogleCallback'])->name('auth.google.callback');


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
