<?php

namespace App\Http\Controllers\Challenger;

use App\Http\Controllers\Controller;
use App\Models\Contest;
use App\Models\ContestParticipant;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ContestController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $mine = ContestParticipant::where('user_id', $user->id)->get()->keyBy('contest_id');

        $contests = Contest::query()
            ->with('categories:id,name')
            ->withCount('exams')
            ->where(fn ($q) => $q->whereIn('id', $mine->keys())->orWhere('status', 'registration'))
            ->where('status', '!=', 'draft')
            ->orderByDesc('year')
            ->get()
            ->map(fn ($contest) => [
                ...$contest->only(['id', 'name', 'description', 'year', 'status', 'registration_start_at', 'registration_end_at', 'start_at', 'end_at', 'exams_count']),
                'categories' => $contest->categories,
                'registration_open' => $contest->isRegistrationOpen(),
                'participation' => $mine->get($contest->id)?->load('category:id,name'),
            ]);

        return Inertia::render('challenger/contests/index', ['contests' => $contests]);
    }

    public function register(Request $request, Contest $contest)
    {
        $data = $request->validate(['category_id' => ['required', 'exists:categories,id']]);

        if (! $contest->isRegistrationOpen()) {
            throw ValidationException::withMessages(['category_id' => 'Les inscriptions ne sont pas ouvertes pour ce concours.']);
        }

        if (! $contest->categories()->where('categories.id', $data['category_id'])->exists()) {
            throw ValidationException::withMessages(['category_id' => 'Catégorie non acceptée pour ce concours.']);
        }

        if (ContestParticipant::where('user_id', $request->user()->id)->where('contest_id', $contest->id)->exists()) {
            throw ValidationException::withMessages(['category_id' => 'Vous êtes déjà inscrit à ce concours.']);
        }

        ContestParticipant::create([
            'user_id' => $request->user()->id,
            'contest_id' => $contest->id,
            'category_id' => $data['category_id'],
            'status' => 'registered',
            'registered_at' => now(),
        ]);

        return back()->with('success', 'Inscription enregistrée.');
    }
}
