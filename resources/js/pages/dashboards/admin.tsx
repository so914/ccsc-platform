import { StatCard } from '@/components/contest/stat-card';
import { StatusBadge } from '@/components/contest/status-badge';
import { PageHeader } from '@/components/contest/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import { Head } from '@inertiajs/react';

interface Props {
    contest: { id: number; name: string; year: number; status: string } | null;
    stats: Record<string, number>;
    nextExam: { id: number; name: string; start_at: string; contest: { name: string } } | null;
    recentActivities: { id: number; description: string; subject_type: string | null; causer_name: string; created_at: string }[];
}

export default function AdminDashboard({ contest, stats, nextExam, recentActivities }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }]}>
            <Head title="Tableau de bord" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader
                    title="Tableau de bord"
                    description={contest ? `${contest.name} ${contest.year}` : 'Aucun concours actif'}
                    actionLabel="Nouveau concours"
                    actionHref="/admin/contests/create"
                >
                    {contest && <StatusBadge value={contest.status} />}
                </PageHeader>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Challengers" value={stats.challengers} />
                    <StatCard title="Participants" value={stats.participants} />
                    <StatCard title="Agents" value={stats.agents} />
                    <StatCard title="Soumissions" value={stats.submissions} />
                    <StatCard title="Examens actifs" value={stats.active_exams} />
                    <StatCard title="Examens terminés" value={stats.finished_exams} />
                    <StatCard title="Candidats qualifiés" value={stats.qualified} />
                    <StatCard title="Finalistes" value={stats.finalists} />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Prochain examen</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {nextExam ? (
                                <div>
                                    <p className="font-medium">{nextExam.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {nextExam.contest?.name} - {formatDate(nextExam.start_at)}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucun examen programmé.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Activité récente</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {recentActivities.length === 0 && <p className="text-sm text-muted-foreground">Aucune activité.</p>}
                            {recentActivities.map((a) => (
                                <div key={a.id} className="flex justify-between text-sm">
                                    <span>
                                        {a.causer_name} : {a.description} {a.subject_type}
                                    </span>
                                    <span className="text-muted-foreground">{a.created_at}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
