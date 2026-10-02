import { PageHeader } from '@/components/contest/page-header';
import { StatCard } from '@/components/contest/stat-card';
import { StatusBadge } from '@/components/contest/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import { Head, Link } from '@inertiajs/react';

interface Props {
    contests: { id: number; name: string; year: number; status: string }[];
    stats: Record<string, number>;
    exams: { id: number; name: string; status: string; start_at: string | null; contest: { name: string } }[];
}

export default function AgentDashboard({ contests, stats, exams }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }]}>
            <Head title="Tableau de bord" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Tableau de bord" actionLabel="Nouvel examen" actionHref="/agent/exams/create" />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Examens gérés" value={stats.exams} />
                    <StatCard title="Challenges" value={stats.challenges} />
                    <StatCard title="Soumissions" value={stats.submissions} />
                    <StatCard title="Résultats" value={stats.results} />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mes concours</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {contests.length === 0 && <p className="text-sm text-muted-foreground">Aucun concours affecté.</p>}
                            {contests.map((c) => (
                                <Link key={c.id} href={`/agent/contests/${c.id}`} className="flex items-center justify-between text-sm hover:underline">
                                    <span>
                                        {c.name} {c.year}
                                    </span>
                                    <StatusBadge value={c.status} />
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Derniers examens</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {exams.length === 0 && <p className="text-sm text-muted-foreground">Aucun examen.</p>}
                            {exams.map((e) => (
                                <Link key={e.id} href={`/agent/exams/${e.id}`} className="flex items-center justify-between text-sm hover:underline">
                                    <span>
                                        {e.name} <span className="text-muted-foreground">({formatDate(e.start_at)})</span>
                                    </span>
                                    <StatusBadge value={e.status} />
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
