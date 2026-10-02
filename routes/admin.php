<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AgentController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ExportController;
use App\Http\Controllers\Admin\FinalistController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\ParticipantController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RegistrationController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WorkshopController;
use App\Http\Controllers\Shared\ChallengeController;
use App\Http\Controllers\Shared\ChallengerController;
use App\Http\Controllers\Shared\ContestController;
use App\Http\Controllers\Shared\ExamController;
use App\Http\Controllers\Shared\QuestionBankController;
use App\Http\Controllers\Shared\RankingController;
use App\Http\Controllers\Shared\ResultController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('contests', [ContestController::class, 'index'])->name('contests.index')->middleware('permission:contests.view');
    Route::get('contests/create', [ContestController::class, 'create'])->name('contests.create')->middleware('permission:contests.create');
    Route::post('contests', [ContestController::class, 'store'])->name('contests.store')->middleware('permission:contests.create');
    Route::get('contests/{contest}', [ContestController::class, 'show'])->name('contests.show')->middleware('permission:contests.view');
    Route::get('contests/{contest}/edit', [ContestController::class, 'edit'])->name('contests.edit')->middleware('permission:contests.edit');
    Route::put('contests/{contest}', [ContestController::class, 'update'])->name('contests.update')->middleware('permission:contests.edit');
    Route::post('contests/{contest}/archive', [ContestController::class, 'archive'])->name('contests.archive')->middleware('permission:contests.archive');

    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index')->middleware('permission:categories.view');
    Route::get('categories/create', [CategoryController::class, 'create'])->name('categories.create')->middleware('permission:categories.create');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store')->middleware('permission:categories.create');
    Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit')->middleware('permission:categories.edit');
    Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update')->middleware('permission:categories.edit');

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
    Route::get('participants', [ParticipantController::class, 'index'])->name('participants.index')->middleware('permission:participants.view');
    Route::get('agents', [AgentController::class, 'index'])->name('agents.index')->middleware('permission:agents.view');
    Route::get('registrations', [RegistrationController::class, 'index'])->name('registrations.index')->middleware('permission:registrations.manage');
    Route::post('registrations', [RegistrationController::class, 'store'])->name('registrations.store')->middleware('permission:registrations.manage');
    Route::put('registrations/{registration}', [RegistrationController::class, 'update'])->name('registrations.update')->middleware('permission:registrations.manage');

    Route::get('results', [ResultController::class, 'index'])->name('results.index')->middleware('permission:results.view');
    Route::get('rankings', [RankingController::class, 'index'])->name('rankings.index')->middleware('permission:rankings.view');
    Route::get('finalists', [FinalistController::class, 'index'])->name('finalists.index')->middleware('permission:finalists.view');
    Route::post('finalists/qualify', [FinalistController::class, 'qualify'])->name('finalists.qualify')->middleware('permission:finalists.manage');
    Route::put('finalists/{finalist}', [FinalistController::class, 'update'])->name('finalists.update')->middleware('permission:finalists.manage');
    Route::get('winners', [FinalistController::class, 'winners'])->name('winners.index')->middleware('permission:finalists.view');

    Route::get('workshops', [WorkshopController::class, 'index'])->name('workshops.index')->middleware('permission:workshops.view');
    Route::get('workshops/create', [WorkshopController::class, 'create'])->name('workshops.create')->middleware('permission:workshops.create');
    Route::post('workshops', [WorkshopController::class, 'store'])->name('workshops.store')->middleware('permission:workshops.create');
    Route::get('workshop-registrations', [WorkshopController::class, 'registrations'])->name('workshops.registrations')->middleware('permission:workshops.view');
    Route::get('workshops/{workshop}', [WorkshopController::class, 'show'])->name('workshops.show')->middleware('permission:workshops.view');
    Route::get('workshops/{workshop}/edit', [WorkshopController::class, 'edit'])->name('workshops.edit')->middleware('permission:workshops.edit');
    Route::put('workshops/{workshop}', [WorkshopController::class, 'update'])->name('workshops.update')->middleware('permission:workshops.edit');
    Route::post('workshops/{workshop}/resources', [WorkshopController::class, 'uploadResource'])->name('workshops.resources.store')->middleware('permission:workshops.edit');
    Route::delete('workshops/{workshop}/resources/{media}', [WorkshopController::class, 'destroyResource'])->name('workshops.resources.destroy')->middleware('permission:workshops.edit');

    // Users
    Route::get('users', [UserController::class, 'index'])->name('users.index')->middleware('permission:users.view');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create')->middleware('permission:users.create');
    Route::post('users', [UserController::class, 'store'])->name('users.store')->middleware('permission:users.create');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit')->middleware('permission:users.edit');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update')->middleware('permission:users.edit');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy')->middleware('permission:users.delete');

    // Roles
    Route::get('roles', [RoleController::class, 'index'])->name('roles.index')->middleware('permission:roles.view');
    Route::get('roles/create', [RoleController::class, 'create'])->name('roles.create')->middleware('permission:roles.create');
    Route::post('roles', [RoleController::class, 'store'])->name('roles.store')->middleware('permission:roles.create');
    Route::get('roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit')->middleware('permission:roles.edit');
    Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update')->middleware('permission:roles.edit');
    Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy')->middleware('permission:roles.delete');

    // Permissions
    Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index')->middleware('permission:permissions.view');
    Route::get('permissions/create', [PermissionController::class, 'create'])->name('permissions.create')->middleware('permission:permissions.create');
    Route::post('permissions', [PermissionController::class, 'store'])->name('permissions.store')->middleware('permission:permissions.create');
    Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy')->middleware('permission:permissions.delete');

    // Activity Logs
    Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index')->middleware('permission:activity-logs.view');

    // Settings
    Route::get('settings', [SettingsController::class, 'index'])->name('settings.index')->middleware('permission:settings.view');
    Route::put('settings', [SettingsController::class, 'update'])->name('settings.update')->middleware('permission:settings.edit');

    // Media
    Route::get('media', [MediaController::class, 'index'])->name('media.index')->middleware('permission:settings.view');
    Route::delete('media/{medium}', [MediaController::class, 'destroy'])->name('media.destroy')->middleware('permission:settings.edit');

    // Exports
    Route::get('export/users', [ExportController::class, 'users'])->name('export.users')->middleware('permission:users.view');
    Route::get('export/roles', [ExportController::class, 'roles'])->name('export.roles')->middleware('permission:roles.view');
    Route::get('export/activity-logs', [ExportController::class, 'activityLogs'])->name('export.activity-logs')->middleware('permission:activity-logs.view');
});
