<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('exam_id')->constrained()->restrictOnDelete();
            $table->unsignedSmallInteger('attempt_number')->default(1);
            $table->dateTime('started_at');
            $table->dateTime('expires_at');
            $table->dateTime('submitted_at')->nullable();
            $table->unsignedInteger('score')->default(0);
            $table->string('status')->default('in_progress');
            $table->timestamps();
            $table->unique(['user_id', 'exam_id', 'attempt_number']);
        });

        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attempt_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('exam_id')->constrained()->restrictOnDelete();
            $table->foreignId('challenge_id')->constrained()->restrictOnDelete();
            $table->json('answer')->nullable();
            $table->boolean('is_correct')->nullable();
            $table->unsignedInteger('points_awarded')->default(0);
            $table->dateTime('submitted_at');
            $table->timestamps();
            $table->unique(['attempt_id', 'challenge_id']);
        });

        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contest_id')->constrained()->restrictOnDelete();
            $table->foreignId('exam_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('attempt_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('score')->default(0);
            $table->unsignedInteger('max_score')->default(0);
            $table->decimal('percentage', 5, 2)->default(0);
            $table->string('status')->default('failed');
            $table->boolean('qualified')->default(false);
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->dateTime('submitted_at')->nullable();
            $table->dateTime('computed_at')->nullable();
            $table->timestamps();
            $table->unique(['exam_id', 'user_id']);
        });

        Schema::create('finalists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contest_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('preselection_rank')->nullable();
            $table->unsignedInteger('preselection_score')->default(0);
            $table->string('status')->default('qualified');
            $table->unsignedSmallInteger('final_position')->nullable();
            $table->timestamps();
            $table->unique(['contest_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('finalists');
        Schema::dropIfExists('results');
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('attempts');
    }
};
