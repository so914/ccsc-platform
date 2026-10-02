import { PageHeader } from '@/components/contest/page-header';
import { StatCard } from '@/components/contest/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import { Head, Link } from '@inertiajs/react';

interface Props {
    upcoming: { id: number; title: string; starts_at: string; speaker_name: string | null }[];
    stats: { followed: number; registered: number; available: number };
}

export default function ParticipantDashboard({ upcoming, stats }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }]}>
            <Head title="Tableau de bord" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Tableau de bord" actionLabel="Voir les ateliers" actionHref="/participant/workshops" />

                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard title="Ateliers suivis" value={stats.followed} />
                    <StatCard title="Inscriptions actives" value={stats.registered} />
                    <StatCard title="Ateliers à venir" value={stats.available} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Mes prochains ateliers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {upcoming.length === 0 && <p className="text-sm text-muted-foreground">Aucun atelier à venir.</p>}
                        {upcoming.map((w) => (
                            <Link key={w.id} href={`/participant/workshops/${w.id}`} className="flex justify-between text-sm hover:underline">
                                <span>
                                    {w.title}
                                    {w.speaker_name && <span className="text-muted-foreground"> - {w.speaker_name}</span>}
                                </span>
                                <span className="text-muted-foreground">{formatDate(w.starts_at)}</span>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
