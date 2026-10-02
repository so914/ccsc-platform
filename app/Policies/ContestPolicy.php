<?php

namespace App\Policies;

use App\Models\Contest;
use App\Models\User;

class ContestPolicy
{
    public function view(User $user, Contest $contest): bool
    {
        return $user->can('contests.view') && $contest->isManagedBy($user);
    }

    public function update(User $user, Contest $contest): bool
    {
        return $user->can('contests.edit') && $contest->isManagedBy($user);
    }
}
