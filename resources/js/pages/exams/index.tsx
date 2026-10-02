import { FilterBar } from '@/components/contest/filter-bar';
import { PageHeader } from '@/components/contest/page-header';
import { StatusBadge } from '@/components/contest/status-badge';
import { type ContestRef, type Paginator } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate, label } from '@/lib/format';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Exam {
    id: number;
    name: string;
    status: string;
    duration_minutes: number;
    start_at: string | null;
    end_at: string | null;
    challenges_count: number;
    contest: ContestRef;
}

interface Props {
    exams: Paginator<Exam>;
    contests: ContestRef[];
    statuses: string[];
    filters: Record<string, string>;
    prefix: string;
}

export default function ExamsIndex({ exams, contests, statuses, filters, prefix }: Props) {
    const { auth } = usePage<SharedData>().props;
    const base = `/${prefix}/exams`;

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Examens', href: base }]}>
            <Head title="Examens" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader
                    title="Examens"
                    actionLabel={auth.permissions.includes('exams.create') ? 'Nouvel examen' : undefined}
                    actionHref={`${base}/create`}
                />

                <FilterBar
                    url={base}
                    filters={filters}
                    searchPlaceholder="Rechercher un examen..."
                    selects={[
                        { name: 'contest', placeholder: 'Tous les concours', options: contests.map((c) => ({ value: c.id, label: `${c.name} ${c.year}` })) },
                        { name: 'status', placeholder: 'Tous les statuts', options: statuses.map((s) => ({ value: s, label: label(s) })) },
                    ]}
                />

                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Concours</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Ouverture</TableHead>
                                    <TableHead>Durée</TableHead>
                                    <TableHead>Challenges</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {exams.data.map((e) => (
                                    <TableRow key={e.id}>
                                        <TableCell className="font-medium">{e.name}</TableCell>
                                        <TableCell>{e.contest.name} {e.contest.year}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={e.status} />
                                        </TableCell>
                                        <TableCell>{formatDate(e.start_at)}</TableCell>
                                        <TableCell>{e.duration_minutes} min</TableCell>
                                        <TableCell>{e.challenges_count}</TableCell>
                                        <TableCell className="space-x-2 text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`${base}/${e.id}`}>Ouvrir</Link>
                                            </Button>
                                            {auth.permissions.includes('exams.edit') && (
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`${base}/${e.id}/edit`}>Modifier</Link>
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {exams.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                            Aucun examen.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <DataTablePagination data={exams} />
            </div>
        </AppLayout>
    );
}
