<?php

namespace App\Policies;

use App\Models\Exam;
use App\Models\User;

class ExamPolicy
{
    public function view(User $user, Exam $exam): bool
    {
        return $user->can('exams.view') && $exam->contest->isManagedBy($user);
    }

    public function update(User $user, Exam $exam): bool
    {
        return $user->can('exams.edit') && $exam->contest->isManagedBy($user);
    }
}
