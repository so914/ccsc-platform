import { FilterBar } from '@/components/contest/filter-bar';
import { PageHeader } from '@/components/contest/page-header';
import { type ContestRef, type Ref } from '@/components/contest/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatDuration, label } from '@/lib/format';
import { Head } from '@inertiajs/react';

interface Row {
    rank: number;
    user_id: number;
    name: string;
    total_score: number;
    total_max: number;
    total_duration: number;
    last_submitted_at: string | null;
}

interface Props {
    ranking: Row[];
    contests: ContestRef[];
    contest: (ContestRef & { tie_breakers: string[] | null }) | null;
    exams: Ref[];
    categories: Ref[];
    filters: Record<string, string>;
    prefix: string;
}

export default function RankingsIndex({ ranking, contests, contest, exams, categories, filters, prefix }: Props) {
    const base = `/${prefix}/rankings`;
    const current = { ...filters, contest: filters.contest ?? (contest ? String(contest.id) : '') };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Classements', href: base }]}>
            <Head title="Classements" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader
                    title="Classements"
                    description={contest ? `Départage : ${(contest.tie_breakers ?? ['score_desc', 'time_asc', 'submitted_at_asc']).map(label).join(' puis ')}` : undefined}
                />
                <FilterBar
                    url={base}
                    filters={current}
                    selects={[
                        { name: 'contest', placeholder: 'Concours', options: contests.map((c) => ({ value: c.id, label: `${c.name} ${c.year}` })) },
                        { name: 'category', placeholder: 'Toutes les catégories', options: categories.map((c) => ({ value: c.id, label: c.name })) },
                        { name: 'exam', placeholder: 'Tous les examens', options: exams.map((e) => ({ value: e.id, label: e.name })) },
                    ]}
                />
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rang</TableHead>
                                    <TableHead>Candidat</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Temps utilisé</TableHead>
                                    <TableHead>Dernière soumission</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ranking.map((r) => (
                                    <TableRow key={r.user_id}>
                                        <TableCell className="font-bold">#{r.rank}</TableCell>
                                        <TableCell>{r.name}</TableCell>
                                        <TableCell>{r.total_score} / {r.total_max}</TableCell>
                                        <TableCell>{formatDuration(Number(r.total_duration))}</TableCell>
                                        <TableCell>{formatDate(r.last_submitted_at)}</TableCell>
                                    </TableRow>
                                ))}
                                {ranking.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                            Aucun classement disponible.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
