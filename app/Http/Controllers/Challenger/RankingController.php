<?php

namespace App\Http\Controllers\Challenger;

use App\Http\Controllers\Controller;
use App\Models\Contest;
use App\Services\RankingService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RankingController extends Controller
{
    public function index(Request $request, RankingService $service)
    {
        $user = $request->user();
        $participations = $user->participations()->with('category:id,name')->get()->keyBy('contest_id');
        $contests = Contest::whereIn('id', $participations->keys())->orderByDesc('year')->get(['id', 'name', 'year']);
        $contest = $contests->firstWhere('id', (int) $request->input('contest')) ?? $contests->first();

        $ranking = [];
        $category = null;

        if ($contest) {
            $category = $participations->get($contest->id)->category;
            $ranking = $service->ranking(Contest::find($contest->id), $category)->values()
                ->map(fn ($row) => [
                    'rank' => $row->rank,
                    'name' => $row->name,
                    'total_score' => (int) $row->total_score,
                    'total_duration' => (int) $row->total_duration,
                    'is_me' => $row->user_id === $user->id,
                ]);
        }

        return Inertia::render('challenger/ranking', [
            'ranking' => $ranking,
            'contests' => $contests,
            'contest' => $contest,
            'category' => $category,
        ]);
    }
}
