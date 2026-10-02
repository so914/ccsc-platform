<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Workshop;
use App\Models\WorkshopRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class WorkshopController extends Controller
{
    public function index(Request $request)
    {
        $mine = WorkshopRegistration::where('user_id', $request->user()->id)->where('status', 'registered')->pluck('workshop_id');

        $workshops = Workshop::query()
            ->where('status', 'published')
            ->withCount(['registrations as registrations_count' => fn ($q) => $q->where('status', 'registered')])
            ->orderBy('starts_at')
            ->get()
            ->map(fn ($w) => [...$w->only(['id', 'title', 'description', 'starts_at', 'duration_minutes', 'capacity', 'speaker_name', 'registrations_count']), 'registered' => $mine->contains($w->id)]);

        return Inertia::render('participant/workshops/index', ['workshops' => $workshops]);
    }

    public function show(Request $request, Workshop $workshop)
    {
        Gate::authorize('view', $workshop);

        $registered = WorkshopRegistration::where('user_id', $request->user()->id)
            ->where('workshop_id', $workshop->id)->where('status', 'registered')->exists();

        return Inertia::render('participant/workshops/show', [
            'workshop' => [...$workshop->only(['id', 'title', 'description', 'starts_at', 'duration_minutes', 'capacity', 'speaker_name']), 'registrations_count' => $workshop->activeRegistrationsCount()],
            'registered' => $registered,
            'resources' => $registered ? $workshop->getMedia('resources')->map(fn ($m) => ['id' => $m->id, 'name' => $m->file_name, 'url' => $m->getUrl()]) : [],
        ]);
    }

    public function register(Request $request, Workshop $workshop)
    {
        Gate::authorize('register', $workshop);

        $registration = WorkshopRegistration::firstOrNew(['workshop_id' => $workshop->id, 'user_id' => $request->user()->id]);

        if ($registration->exists && $registration->status === 'registered') {
            return back();
        }

        if ($workshop->isFull()) {
            throw ValidationException::withMessages(['workshop' => 'Cet atelier est complet.']);
        }

        $registration->fill(['status' => 'registered', 'registered_at' => now()])->save();

        return back()->with('success', 'Inscription à l\'atelier enregistrée.');
    }

    public function unregister(Request $request, Workshop $workshop)
    {
        WorkshopRegistration::where('workshop_id', $workshop->id)
            ->where('user_id', $request->user()->id)
            ->update(['status' => 'cancelled']);

        return back()->with('success', 'Inscription annulée.');
    }
}
