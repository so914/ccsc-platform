<?php

namespace App\Http\Controllers\Participant;

use App\Http\Controllers\Controller;
use App\Models\WorkshopRegistration;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ParticipationController extends Controller
{
    public function index(Request $request)
    {
        $participations = WorkshopRegistration::with('workshop:id,title,starts_at,speaker_name,status')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('registered_at')
            ->get();

        return Inertia::render('participant/participations', ['participations' => $participations]);
    }
}
