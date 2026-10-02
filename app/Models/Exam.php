<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Exam extends Model
{
    use LogsActivity;

    public const STATUSES = ['draft', 'scheduled', 'open', 'closed', 'archived'];

    protected $fillable = [
        'contest_id', 'name', 'description', 'duration_minutes', 'start_at', 'end_at',
        'status', 'max_attempts', 'passing_score', 'created_by',
    ];

    protected function casts(): array
    {
        return ['start_at' => 'datetime', 'end_at' => 'datetime'];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logFillable()->logOnlyDirty();
    }

    public function contest(): BelongsTo
    {
        return $this->belongsTo(Contest::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function challenges(): BelongsToMany
    {
        return $this->belongsToMany(Challenge::class)
            ->withPivot(['position', 'points'])
            ->orderBy('challenge_exam.position');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(Attempt::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(Result::class);
    }

    public function scopeForUser(Builder $query, User $user): Builder
    {
        if ($user->hasRole('admin')) {
            return $query;
        }

        return $query->whereHas('contest.agents', fn ($q) => $q->where('users.id', $user->id));
    }

    public function isAvailable(): bool
    {
        if (! in_array($this->status, ['scheduled', 'open'], true)) {
            return false;
        }

        $now = now();

        return (! $this->start_at || $this->start_at <= $now)
            && (! $this->end_at || $this->end_at >= $now);
    }

    public function maxScore(): int
    {
        return (int) $this->challenges->sum(fn ($challenge) => $challenge->pivot->points ?? $challenge->points);
    }

    public function challengePoints(Challenge $challenge): int
    {
        $pivot = $this->challenges->firstWhere('id', $challenge->id)?->pivot;

        return (int) ($pivot?->points ?? $challenge->points);
    }

    public function hasAttempts(): bool
    {
        return $this->attempts()->exists();
    }
}
