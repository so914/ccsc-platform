<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('contests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('year');
            $table->dateTime('registration_start_at')->nullable();
            $table->dateTime('registration_end_at')->nullable();
            $table->dateTime('start_at')->nullable();
            $table->dateTime('end_at')->nullable();
            $table->string('status')->default('draft');
            $table->json('tie_breakers')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->restrictOnDelete();
            $table->timestamps();
            $table->unique(['name', 'year']);
        });

        Schema::create('category_contest', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contest_id')->constrained()->restrictOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->unique(['contest_id', 'category_id']);
        });

        Schema::create('contest_agent', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contest_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->unique(['contest_id', 'user_id']);
        });

        Schema::create('contest_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('contest_id')->constrained()->restrictOnDelete();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('status')->default('registered');
            $table->dateTime('registered_at')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'contest_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contest_participants');
        Schema::dropIfExists('contest_agent');
        Schema::dropIfExists('category_contest');
        Schema::dropIfExists('contests');
        Schema::dropIfExists('categories');
    }
};
