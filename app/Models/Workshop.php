<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Workshop extends Model implements HasMedia
{
    use InteractsWithMedia, LogsActivity;

    public const STATUSES = ['draft', 'published', 'finished', 'archived'];

    protected $fillable = [
        'contest_id', 'title', 'description', 'starts_at', 'duration_minutes',
        'capacity', 'speaker_name', 'status',
    ];

    protected function casts(): array
    {
        return ['starts_at' => 'datetime'];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logFillable()->logOnlyDirty();
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('resources');
    }

    public function contest(): BelongsTo
    {
        return $this->belongsTo(Contest::class);
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(WorkshopRegistration::class);
    }

    public function activeRegistrationsCount(): int
    {
        return $this->registrations()->where('status', 'registered')->count();
    }

    public function isFull(): bool
    {
        return $this->activeRegistrationsCount() >= $this->capacity;
    }
}
