import { PageHeader } from '@/components/contest/page-header';
import { StatCard } from '@/components/contest/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import { Head, Link } from '@inertiajs/react';

interface Props {
    participation: { contest: { name: string; year: number }; category: { name: string } } | null;
    stats: { available_exams: number; finished_exams: number; score: number; rank: number | null };
    deadlines: { id: number; name: string; end_at: string | null }[];
}

export default function ChallengerDashboard({ participation, stats, deadlines }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }]}>
            <Head title="Tableau de bord" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader
                    title="Tableau de bord"
                    description={participation ? `${participation.contest.name} ${participation.contest.year} - catégorie ${participation.category.name}` : 'Vous n\'êtes inscrit à aucun concours'}
                />

                {!participation && (
                    <Card>
                        <CardContent className="flex items-center justify-between py-6">
                            <p className="text-sm">Consultez les concours ouverts aux inscriptions.</p>
                            <Button asChild>
                                <Link href="/challenger/contests">Voir les concours</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Examens disponibles" value={stats.available_exams} />
                    <StatCard title="Examens terminés" value={stats.finished_exams} />
                    <StatCard title="Score total" value={stats.score} />
                    <StatCard title="Classement" value={stats.rank ? `#${stats.rank}` : '-'} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Prochaines échéances</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {deadlines.length === 0 && <p className="text-sm text-muted-foreground">Aucun examen ouvert.</p>}
                        {deadlines.map((d) => (
                            <Link key={d.id} href={`/challenger/exams/${d.id}`} className="flex justify-between text-sm hover:underline">
                                <span>{d.name}</span>
                                <span className="text-muted-foreground">Fin : {formatDate(d.end_at)}</span>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
