<?php

use App\Http\Controllers\Challenger\ContestController;
use App\Http\Controllers\Challenger\ExamController;
use App\Http\Controllers\Challenger\RankingController;
use App\Http\Controllers\Challenger\ResultController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:challenger'])->prefix('challenger')->name('challenger.')->group(function () {
    Route::get('contests', [ContestController::class, 'index'])->name('contests.index');
    Route::post('contests/{contest}/register', [ContestController::class, 'register'])->name('contests.register');

    Route::get('exams', [ExamController::class, 'index'])->name('exams.index');
    Route::get('exams/{exam}', [ExamController::class, 'show'])->name('exams.show');
    Route::post('exams/{exam}/start', [ExamController::class, 'start'])->name('exams.start');
    Route::put('attempts/{attempt}/answers', [ExamController::class, 'save'])->name('attempts.save');
    Route::post('attempts/{attempt}/submit', [ExamController::class, 'submit'])->name('attempts.submit');

    Route::get('results', [ResultController::class, 'index'])->name('results.index');
    Route::get('results/{result}', [ResultController::class, 'show'])->name('results.show');
    Route::get('ranking', [RankingController::class, 'index'])->name('ranking');
});
