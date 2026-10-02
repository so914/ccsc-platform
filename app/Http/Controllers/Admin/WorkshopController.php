<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contest;
use App\Models\Workshop;
use App\Models\WorkshopRegistration;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WorkshopController extends Controller
{
    public function index(Request $request)
    {
        $workshops = Workshop::query()
            ->withCount(['registrations as registrations_count' => fn ($q) => $q->where('status', 'registered')])
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->status))
            ->when($request->filled('search'), fn ($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->orderByDesc('starts_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/workshops/index', [
            'workshops' => $workshops,
            'statuses' => Workshop::STATUSES,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/workshops/form', $this->formProps(null));
    }

    public function store(Request $request)
    {
        $workshop = Workshop::create($this->validated($request));

        return redirect()->route('admin.workshops.show', $workshop)->with('success', 'Atelier créé.');
    }

    public function show(Workshop $workshop)
    {
        $workshop->load(['registrations.user:id,name,email', 'contest:id,name,year']);

        return Inertia::render('admin/workshops/show', [
            'workshop' => $workshop,
            'resources' => $workshop->getMedia('resources')->map(fn ($m) => ['id' => $m->id, 'name' => $m->file_name, 'url' => $m->getUrl()]),
        ]);
    }

    public function edit(Workshop $workshop)
    {
        return Inertia::render('admin/workshops/form', $this->formProps($workshop));
    }

    public function update(Request $request, Workshop $workshop)
    {
        $workshop->update($this->validated($request));

        return redirect()->route('admin.workshops.show', $workshop)->with('success', 'Atelier mis à jour.');
    }

    public function registrations(Request $request)
    {
        $registrations = WorkshopRegistration::query()
            ->with(['user:id,name,email', 'workshop:id,title,starts_at'])
            ->when($request->filled('workshop'), fn ($q) => $q->where('workshop_id', $request->workshop))
            ->latest('registered_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/workshops/registrations', [
            'registrations' => $registrations,
            'workshops' => Workshop::orderByDesc('starts_at')->get(['id', 'title']),
            'filters' => $request->only('workshop'),
        ]);
    }

    public function uploadResource(Request $request, Workshop $workshop)
    {
        $request->validate(['file' => ['required', 'file', 'max:20480']]);
        $workshop->addMediaFromRequest('file')->toMediaCollection('resources');

        return back()->with('success', 'Ressource ajoutée.');
    }

    public function destroyResource(Workshop $workshop, int $media)
    {
        $workshop->getMedia('resources')->firstWhere('id', $media)?->delete();

        return back()->with('success', 'Ressource retirée.');
    }

    private function formProps(?Workshop $workshop): array
    {
        return [
            'workshop' => $workshop,
            'contests' => Contest::orderByDesc('year')->get(['id', 'name', 'year']),
            'statuses' => Workshop::STATUSES,
        ];
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'contest_id' => ['nullable', 'exists:contests,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'starts_at' => ['required', 'date'],
            'duration_minutes' => ['required', 'integer', 'min:1', 'max:1440'],
            'capacity' => ['required', 'integer', 'min:1', 'max:100000'],
            'speaker_name' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(Workshop::STATUSES)],
        ]);
    }
}
