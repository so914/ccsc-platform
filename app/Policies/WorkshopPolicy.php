<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workshop;

class WorkshopPolicy
{
    public function view(User $user, Workshop $workshop): bool
    {
        if ($user->can('workshops.view')) {
            return true;
        }

        return $workshop->status === 'published';
    }

    public function register(User $user, Workshop $workshop): bool
    {
        return $user->hasRole('participant') && $workshop->status === 'published';
    }
}
