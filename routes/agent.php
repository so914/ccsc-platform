<?php

use App\Http\Controllers\Shared\ChallengeController;
use App\Http\Controllers\Shared\ChallengerController;
use App\Http\Controllers\Shared\ContestController;
use App\Http\Controllers\Shared\ExamController;
use App\Http\Controllers\Shared\QuestionBankController;
use App\Http\Controllers\Shared\RankingController;
use App\Http\Controllers\Shared\ResultController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:agent'])->prefix('agent')->name('agent.')->group(function () {
    Route::get('contests', [ContestController::class, 'index'])->name('contests.index')->middleware('permission:contests.view');
    Route::get('contests/{contest}', [ContestController::class, 'show'])->name('contests.show')->middleware('permission:contests.view');

    Route::get('exams', [ExamController::class, 'index'])->name('exams.index')->middleware('permission:exams.view');
    Route::get('exams/create', [ExamController::class, 'create'])->name('exams.create')->middleware('permission:exams.create');
    Route::post('exams', [ExamController::class, 'store'])->name('exams.store')->middleware('permission:exams.create');
    Route::get('exams/{exam}', [ExamController::class, 'show'])->name('exams.show')->middleware('permission:exams.view');
    Route::get('exams/{exam}/edit', [ExamController::class, 'edit'])->name('exams.edit')->middleware('permission:exams.edit');
    Route::put('exams/{exam}', [ExamController::class, 'update'])->name('exams.update')->middleware('permission:exams.edit');
    Route::put('exams/{exam}/challenges', [ExamController::class, 'syncChallenges'])->name('exams.challenges.sync')->middleware('permission:exams.edit');

    Route::get('challenges', [ChallengeController::class, 'index'])->name('challenges.index')->middleware('permission:challenges.view');
    Route::get('challenges/create', [ChallengeController::class, 'create'])->name('challenges.create')->middleware('permission:challenges.create');
    Route::post('challenges', [ChallengeController::class, 'store'])->name('challenges.store')->middleware('permission:challenges.create');
    Route::get('challenges/{challenge}/edit', [ChallengeController::class, 'edit'])->name('challenges.edit')->middleware('permission:challenges.edit');
    Route::put('challenges/{challenge}', [ChallengeController::class, 'update'])->name('challenges.update')->middleware('permission:challenges.edit');

    Route::get('question-banks', [QuestionBankController::class, 'index'])->name('question-banks.index')->middleware('permission:question-banks.view');
    Route::get('question-banks/create', [QuestionBankController::class, 'create'])->name('question-banks.create')->middleware('permission:question-banks.create');
    Route::post('question-banks', [QuestionBankController::class, 'store'])->name('question-banks.store')->middleware('permission:question-banks.create');
    Route::get('question-banks/{questionBank}', [QuestionBankController::class, 'show'])->name('question-banks.show')->middleware('permission:question-banks.view');
    Route::get('question-banks/{questionBank}/edit', [QuestionBankController::class, 'edit'])->name('question-banks.edit')->middleware('permission:question-banks.edit');
    Route::put('question-banks/{questionBank}', [QuestionBankController::class, 'update'])->name('question-banks.update')->middleware('permission:question-banks.edit');

    Route::get('challengers', [ChallengerController::class, 'index'])->name('challengers.index')->middleware('permission:challengers.view');
    Route::get('results', [ResultController::class, 'index'])->name('results.index')->middleware('permission:results.view');
    Route::get('rankings', [RankingController::class, 'index'])->name('rankings.index')->middleware('permission:rankings.view');
});
