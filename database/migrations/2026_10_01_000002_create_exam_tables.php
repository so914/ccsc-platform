<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contest_id')->constrained()->restrictOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedInteger('duration_minutes')->default(60);
            $table->dateTime('start_at')->nullable();
            $table->dateTime('end_at')->nullable();
            $table->string('status')->default('draft');
            $table->unsignedSmallInteger('max_attempts')->default(1);
            $table->unsignedSmallInteger('passing_score')->default(50);
            $table->foreignId('created_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamps();
        });

        Schema::create('category_exam', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->restrictOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->unique(['exam_id', 'category_id']);
        });

        Schema::create('question_banks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamps();
        });

        Schema::create('challenges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_bank_id')->constrained()->restrictOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('topic')->nullable();
            $table->string('difficulty')->default('easy');
            $table->unsignedInteger('points')->default(100);
            $table->string('answer_type')->default('single_choice');
            $table->text('expected_answer')->nullable();
            $table->text('explanation')->nullable();
            $table->string('status')->default('active');
            $table->foreignId('created_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamps();
        });

        Schema::create('challenge_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challenge_id')->constrained()->restrictOnDelete();
            $table->string('content');
            $table->boolean('is_correct')->default(false);
            $table->unsignedSmallInteger('position')->default(0);
        });

        Schema::create('challenge_exam', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->restrictOnDelete();
            $table->foreignId('challenge_id')->constrained()->restrictOnDelete();
            $table->unsignedSmallInteger('position')->default(0);
            $table->unsignedInteger('points')->nullable();
            $table->unique(['exam_id', 'challenge_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('challenge_exam');
        Schema::dropIfExists('challenge_options');
        Schema::dropIfExists('challenges');
        Schema::dropIfExists('question_banks');
        Schema::dropIfExists('category_exam');
        Schema::dropIfExists('exams');
    }
};
