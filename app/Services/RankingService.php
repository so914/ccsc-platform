<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Contest;
use App\Models\ContestParticipant;
use App\Models\Exam;
use App\Models\Finalist;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RankingService
{
    public function ranking(Contest $contest, ?Category $category = null, ?Exam $exam = null): Collection
    {
        $query = DB::table('results')
            ->join('users', 'users.id', '=', 'results.user_id')
            ->join('contest_participants', function ($join) {
                $join->on('contest_participants.user_id', '=', 'results.user_id')
                    ->on('contest_participants.contest_id', '=', 'results.contest_id');
            })
            ->where('results.contest_id', $contest->id)
            ->where('contest_participants.status', 'registered');

        if ($exam) {
            $query->where('results.exam_id', $exam->id);
        }

        if ($category) {
            $query->where('contest_participants.category_id', $category->id);
        }

        $rows = $query
            ->groupBy('results.user_id', 'users.name', 'contest_participants.category_id')
            ->select([
                'results.user_id',
                'users.name',
                'contest_participants.category_id',
                DB::raw('SUM(results.score) as total_score'),
                DB::raw('SUM(results.max_score) as total_max'),
                DB::raw('SUM(results.duration_seconds) as total_duration'),
                DB::raw('MAX(results.submitted_at) as last_submitted_at'),
            ])
            ->get();

        return $this->assignRanks($rows, $contest->tieBreakerList());
    }

    public function compare(object $a, object $b, array $tieBreakers): int
    {
        foreach ($tieBreakers as $rule) {
            $diff = match ($rule) {
                'score_desc' => $b->total_score <=> $a->total_score,
                'time_asc' => $a->total_duration <=> $b->total_duration,
                'submitted_at_asc' => strcmp((string) $a->last_submitted_at, (string) $b->last_submitted_at),
                default => 0,
            };

            if ($diff !== 0) {
                return $diff;
            }
        }

        return 0;
    }

    private function assignRanks(Collection $rows, array $tieBreakers): Collection
    {
        $sorted = $rows->sort(fn ($a, $b) => $this->compare($a, $b, $tieBreakers))->values();
        $previous = null;
        $rank = 0;

        return $sorted->map(function ($row, $index) use (&$previous, &$rank, $tieBreakers) {
            if (! $previous || $this->compare($previous, $row, $tieBreakers) !== 0) {
                $rank = $index + 1;
            }

            $previous = $row;
            $row->rank = $rank;

            return $row;
        });
    }

    public function qualify(Contest $contest, int $count, ?Category $category = null): int
    {
        $categories = $category ? collect([$category]) : $contest->categories;
        $created = 0;

        foreach ($categories as $cat) {
            $top = $this->ranking($contest, $cat)->filter(fn ($row) => $row->rank <= $count);

            foreach ($top as $row) {
                $finalist = Finalist::firstOrNew(['contest_id' => $contest->id, 'user_id' => $row->user_id]);
                $finalist->fill([
                    'category_id' => $cat->id,
                    'preselection_rank' => $row->rank,
                    'preselection_score' => $row->total_score,
                ]);

                if (! $finalist->exists) {
                    $finalist->status = 'qualified';
                    $created++;
                }

                $finalist->save();
            }
        }

        return $created;
    }

    public function userPosition(Contest $contest, int $userId): ?object
    {
        $participation = ContestParticipant::where('contest_id', $contest->id)->where('user_id', $userId)->first();

        if (! $participation) {
            return null;
        }

        return $this->ranking($contest, $participation->category)->firstWhere('user_id', $userId);
    }
}
