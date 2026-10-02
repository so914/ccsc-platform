<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Submission extends Model
{
    protected $fillable = [
        'attempt_id', 'user_id', 'exam_id', 'challenge_id', 'answer',
        'is_correct', 'points_awarded', 'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'answer' => 'json',
            'is_correct' => 'boolean',
            'submitted_at' => 'datetime',
        ];
    }

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(Attempt::class);
    }

    public function challenge(): BelongsTo
    {
        return $this->belongsTo(Challenge::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
