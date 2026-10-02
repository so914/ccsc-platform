<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Result extends Model
{
    protected $fillable = [
        'contest_id', 'exam_id', 'user_id', 'attempt_id', 'score', 'max_score', 'percentage',
        'status', 'qualified', 'duration_seconds', 'submitted_at', 'computed_at',
    ];

    protected function casts(): array
    {
        return [
            'qualified' => 'boolean',
            'percentage' => 'float',
            'submitted_at' => 'datetime',
            'computed_at' => 'datetime',
        ];
    }

    public function contest(): BelongsTo
    {
        return $this->belongsTo(Contest::class);
    }

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(Attempt::class);
    }
}
