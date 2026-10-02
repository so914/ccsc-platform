<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\Workshop;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResourceController extends Controller
{
    public function index(Request $request)
    {
        $workshops = Workshop::whereHas('registrations', fn ($q) => $q->where('user_id', $request->user()->id)->where('status', 'registered'))
            ->orderByDesc('starts_at')
            ->get();

        $resources = $workshops->flatMap(fn ($w) => $w->getMedia('resources')->map(fn ($m) => [
            'id' => $m->id,
            'name' => $m->file_name,
            'url' => $m->getUrl(),
            'workshop' => $w->title,
        ]))->values();

        return Inertia::render('participant/resources', ['resources' => $resources]);
    }
}
