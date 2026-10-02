import { FilterBar } from '@/components/contest/filter-bar';
import { PageHeader } from '@/components/contest/page-header';
import { StatusBadge } from '@/components/contest/status-badge';
import { type ContestRef, type Paginator, type Ref } from '@/components/contest/types';
import { Card, CardContent } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatDuration } from '@/lib/format';
import { Head } from '@inertiajs/react';

interface Result {
    id: number;
    score: number;
    max_score: number;
    percentage: number;
    status: string;
    qualified: boolean;
    duration_seconds: number;
    submitted_at: string | null;
    user: Ref;
    exam: Ref;
    contest: ContestRef;
}

interface Props {
    results: Paginator<Result>;
    contests: ContestRef[];
    exams: (Ref & { contest_id: number })[];
    categories: Ref[];
    filters: Record<string, string>;
    prefix: string;
}

export default function ResultsIndex({ results, contests, exams, categories, filters, prefix }: Props) {
    const base = `/${prefix}/results`;
    const visibleExams = filters.contest ? exams.filter((e) => String(e.contest_id) === filters.contest) : exams;

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Résultats', href: base }]}>
            <Head title="Résultats" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Résultats" />
                <FilterBar
                    url={base}
                    filters={filters}
                    selects={[
                        { name: 'contest', placeholder: 'Tous les concours', options: contests.map((c) => ({ value: c.id, label: `${c.name} ${c.year}` })) },
                        { name: 'exam', placeholder: 'Tous les examens', options: visibleExams.map((e) => ({ value: e.id, label: e.name })) },
                        { name: 'category', placeholder: 'Toutes les catégories', options: categories.map((c) => ({ value: c.id, label: c.name })) },
                    ]}
                />
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Candidat</TableHead>
                                    <TableHead>Concours</TableHead>
                                    <TableHead>Examen</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>%</TableHead>
                                    <TableHead>Durée</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Qualifié</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.data.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-medium">{r.user.name}</TableCell>
                                        <TableCell>{r.contest.name} {r.contest.year}</TableCell>
                                        <TableCell>{r.exam.name}</TableCell>
                                        <TableCell>{r.score} / {r.max_score}</TableCell>
                                        <TableCell>{r.percentage} %</TableCell>
                                        <TableCell>{formatDuration(r.duration_seconds)}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={r.status} />
                                        </TableCell>
                                        <TableCell>{r.qualified ? 'Oui' : 'Non'}</TableCell>
                                        <TableCell>{formatDate(r.submitted_at)}</TableCell>
                                    </TableRow>
                                ))}
                                {results.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                                            Aucun résultat.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <DataTablePagination data={results} />
            </div>
        </AppLayout>
    );
}
