<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Challenge extends Model
{
    public const ANSWER_TYPES = ['single_choice', 'multiple_choice', 'short_text', 'flag'];

    public const DIFFICULTIES = ['easy', 'medium', 'hard'];

    public const STATUSES = ['active', 'archived'];

    protected $fillable = [
        'question_bank_id', 'title', 'description', 'topic', 'difficulty', 'points',
        'answer_type', 'expected_answer', 'explanation', 'status', 'created_by',
    ];

    public function bank(): BelongsTo
    {
        return $this->belongsTo(QuestionBank::class, 'question_bank_id');
    }

    public function options(): HasMany
    {
        return $this->hasMany(ChallengeOption::class)->orderBy('position');
    }

    public function exams(): BelongsToMany
    {
        return $this->belongsToMany(Exam::class)->withPivot(['position', 'points']);
    }

    public function hasChoices(): bool
    {
        return in_array($this->answer_type, ['single_choice', 'multiple_choice'], true);
    }

    public function isLocked(): bool
    {
        return DB::table('challenge_exam')
            ->join('attempts', 'attempts.exam_id', '=', 'challenge_exam.exam_id')
            ->where('challenge_exam.challenge_id', $this->id)
            ->exists();
    }
}
