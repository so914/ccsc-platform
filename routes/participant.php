<?php

use App\Http\Controllers\Participant\ParticipationController;
use App\Http\Controllers\Participant\ResourceController;
use App\Http\Controllers\Participant\WorkshopController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:participant'])->prefix('participant')->name('participant.')->group(function () {
    Route::get('workshops', [WorkshopController::class, 'index'])->name('workshops.index');
    Route::get('workshops/{workshop}', [WorkshopController::class, 'show'])->name('workshops.show');
    Route::post('workshops/{workshop}/register', [WorkshopController::class, 'register'])->name('workshops.register');
    Route::delete('workshops/{workshop}/register', [WorkshopController::class, 'unregister'])->name('workshops.unregister');
    Route::get('resources', [ResourceController::class, 'index'])->name('resources.index');
    Route::get('participations', [ParticipationController::class, 'index'])->name('participations.index');
});
