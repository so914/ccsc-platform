<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'users.view', 'users.create', 'users.edit', 'users.delete',
            'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
            'permissions.view', 'permissions.create', 'permissions.edit', 'permissions.delete',
            'activity-logs.view',
            'settings.view', 'settings.edit',
            'agents.view', 'agents.manage',
            'contests.view', 'contests.create', 'contests.edit', 'contests.archive',
            'categories.view', 'categories.create', 'categories.edit',
            'exams.view', 'exams.create', 'exams.edit',
            'challenges.view', 'challenges.create', 'challenges.edit',
            'question-banks.view', 'question-banks.create', 'question-banks.edit',
            'challengers.view', 'participants.view', 'registrations.manage',
            'results.view', 'rankings.view',
            'finalists.view', 'finalists.manage',
            'workshops.view', 'workshops.create', 'workshops.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        Permission::where('name', 'like', 'master.%')->delete();
        Permission::where('name', 'like', 'ppdb.%')->delete();

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions(Permission::all());

        $agent = Role::firstOrCreate(['name' => 'agent']);
        $agent->syncPermissions([
            'contests.view',
            'exams.view', 'exams.create', 'exams.edit',
            'challenges.view', 'challenges.create', 'challenges.edit',
            'question-banks.view', 'question-banks.create', 'question-banks.edit',
            'challengers.view',
            'results.view', 'rankings.view',
        ]);

        Role::firstOrCreate(['name' => 'challenger']);
        Role::firstOrCreate(['name' => 'participant']);

        $legacy = Role::where('name', 'user')->first();
        if ($legacy && $legacy->users()->count() === 0) {
            $legacy->delete();
        }
    }
}
