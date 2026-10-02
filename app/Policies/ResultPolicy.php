<?php

namespace App\Policies;

use App\Models\Result;
use App\Models\User;

class ResultPolicy
{
    public function view(User $user, Result $result): bool
    {
        if ($result->user_id === $user->id) {
            return true;
        }

        return $user->can('results.view') && $result->contest->isManagedBy($user);
    }
}
