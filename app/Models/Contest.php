<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Contest extends Model
{
    use LogsActivity;

    public const STATUSES = ['draft', 'registration', 'ongoing', 'finished', 'archived'];

    public const DEFAULT_TIE_BREAKERS = ['score_desc', 'time_asc', 'submitted_at_asc'];

    public const TIE_BREAKERS = ['score_desc', 'time_asc', 'submitted_at_asc'];

    protected $fillable = [
        'name', 'description', 'year', 'registration_start_at', 'registration_end_at',
        'start_at', 'end_at', 'status', 'tie_breakers', 'created_by',
    ];

    protected function casts(): array
    {
        return [
            'registration_start_at' => 'datetime',
            'registration_end_at' => 'datetime',
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'tie_breakers' => 'array',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logFillable()->logOnlyDirty();
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function agents(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'contest_agent');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(ContestParticipant::class);
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(Result::class);
    }

    public function finalists(): HasMany
    {
        return $this->hasMany(Finalist::class);
    }

    public function scopeForUser(Builder $query, User $user): Builder
    {
        if ($user->hasRole('admin')) {
            return $query;
        }

        return $query->whereHas('agents', fn ($q) => $q->where('users.id', $user->id));
    }

    public function isManagedBy(User $user): bool
    {
        return $user->hasRole('admin') || $this->agents()->where('users.id', $user->id)->exists();
    }

    public function isRegistrationOpen(): bool
    {
        if ($this->status !== 'registration') {
            return false;
        }

        $now = now();

        return (! $this->registration_start_at || $this->registration_start_at <= $now)
            && (! $this->registration_end_at || $this->registration_end_at >= $now);
    }

    public function tieBreakerList(): array
    {
        return $this->tie_breakers ?: self::DEFAULT_TIE_BREAKERS;
    }
}
