<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workshops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contest_id')->nullable()->constrained()->restrictOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('starts_at');
            $table->unsignedInteger('duration_minutes')->default(60);
            $table->unsignedInteger('capacity')->default(30);
            $table->string('speaker_name')->nullable();
            $table->string('status')->default('draft');
            $table->timestamps();
        });

        Schema::create('workshop_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workshop_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->string('status')->default('registered');
            $table->dateTime('registered_at')->nullable();
            $table->timestamps();
            $table->unique(['workshop_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workshop_registrations');
        Schema::dropIfExists('workshops');
    }
};
