<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contest;
use App\Models\ContestParticipant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class RegistrationController extends Controller
{
    public function index(Request $request)
    {
        $registrations = ContestParticipant::query()
            ->with(['user:id,name,email', 'contest:id,name,year', 'category:id,name'])
            ->when($request->filled('contest'), fn ($q) => $q->where('contest_id', $request->contest))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->latest('registered_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/registrations/index', [
            'registrations' => $registrations,
            'contests' => Contest::with('categories:id,name')->orderByDesc('year')->get(['id', 'name', 'year']),
            'challengers' => User::role('challenger')->orderBy('name')->get(['id', 'name', 'email']),
            'statuses' => ContestParticipant::STATUSES,
            'filters' => $request->only(['contest', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'contest_id' => ['required', 'exists:contests,id'],
            'category_id' => ['required', 'exists:categories,id'],
        ]);

        $contest = Contest::findOrFail($data['contest_id']);

        if (! $contest->categories()->where('categories.id', $data['category_id'])->exists()) {
            throw ValidationException::withMessages(['category_id' => 'Cette catégorie n\'est pas acceptée par ce concours.']);
        }

        if (ContestParticipant::where('user_id', $data['user_id'])->where('contest_id', $contest->id)->exists()) {
            throw ValidationException::withMessages(['user_id' => 'Ce challenger est déjà inscrit à ce concours.']);
        }

        ContestParticipant::create([...$data, 'status' => 'registered', 'registered_at' => now()]);

        return back()->with('success', 'Inscription enregistrée.');
    }

    public function update(Request $request, ContestParticipant $registration)
    {
        $data = $request->validate(['status' => ['required', Rule::in(ContestParticipant::STATUSES)]]);
        $registration->update($data);

        return back()->with('success', 'Statut mis à jour.');
    }
}
