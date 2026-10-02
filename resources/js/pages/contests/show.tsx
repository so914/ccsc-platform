import { PageHeader } from '@/components/contest/page-header';
import { StatCard } from '@/components/contest/stat-card';
import { StatusBadge } from '@/components/contest/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate, label } from '@/lib/format';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

interface Props {
    contest: {
        id: number;
        name: string;
        description: string | null;
        year: number;
        status: string;
        registration_start_at: string | null;
        registration_end_at: string | null;
        start_at: string | null;
        end_at: string | null;
        tie_breakers: string[] | null;
        participants_count: number;
        results_count: number;
        categories: { id: number; name: string }[];
        agents: { id: number; name: string; email: string }[];
        exams: { id: number; name: string; status: string; start_at: string | null; challenges_count: number }[];
    };
    prefix: string;
}

export default function ContestShow({ contest, prefix }: Props) {
    const { auth } = usePage<SharedData>().props;
    const base = `/${prefix}/contests`;

    const archive = () => {
        if (confirm('Archiver ce concours ? Les données sont conservées.')) {
            router.post(`/admin/contests/${contest.id}/archive`);
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Tableau de bord', href: '/dashboard' },
                { title: 'Concours', href: base },
                { title: contest.name, href: '#' },
            ]}
        >
            <Head title={contest.name} />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title={`${contest.name} ${contest.year}`} description={contest.description ?? undefined}>
                    <StatusBadge value={contest.status} />
                    {auth.permissions.includes('contests.edit') && (
                        <Button asChild variant="outline">
                            <Link href={`${base}/${contest.id}/edit`}>Modifier</Link>
                        </Button>
                    )}
                    {auth.permissions.includes('contests.archive') && contest.status !== 'archived' && (
                        <Button variant="outline" onClick={archive}>
                            Archiver
                        </Button>
                    )}
                </PageHeader>

                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard title="Inscrits" value={contest.participants_count} />
                    <StatCard title="Examens" value={contest.exams.length} />
                    <StatCard title="Résultats" value={contest.results_count} />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>Inscriptions : {formatDate(contest.registration_start_at)} - {formatDate(contest.registration_end_at)}</p>
                            <p>Concours : {formatDate(contest.start_at)} - {formatDate(contest.end_at)}</p>
                            <p>Catégories : {contest.categories.map((c) => c.name).join(', ') || '-'}</p>
                            <p>Agents : {contest.agents.map((a) => a.name).join(', ') || '-'}</p>
                            <p>Départage : {(contest.tie_breakers ?? ['score_desc', 'time_asc', 'submitted_at_asc']).map(label).join(' puis ')}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Examens</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Challenges</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contest.exams.map((e) => (
                                        <TableRow key={e.id}>
                                            <TableCell>
                                                <Link className="font-medium hover:underline" href={`/${prefix}/exams/${e.id}`}>
                                                    {e.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge value={e.status} />
                                            </TableCell>
                                            <TableCell>{e.challenges_count}</TableCell>
                                        </TableRow>
                                    ))}
                                    {contest.exams.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                Aucun examen.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
