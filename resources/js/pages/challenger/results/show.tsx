import { PageHeader } from '@/components/contest/page-header';
import { StatCard } from '@/components/contest/stat-card';
import { StatusBadge } from '@/components/contest/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Props {
    result: {
        score: number;
        max_score: number;
        percentage: number;
        status: string;
        qualified: boolean;
        exam: { name: string };
        contest: { name: string; year: number };
    };
    corrections: { title: string; is_correct: boolean | null; points_awarded: number; explanation: string | null }[] | null;
}

export default function ChallengerResultShow({ result, corrections }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Mes résultats', href: '/challenger/results' }, { title: result.exam.name, href: '#' }]}>
            <Head title={result.exam.name} />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title={result.exam.name} description={`${result.contest.name} ${result.contest.year}`}>
                    <StatusBadge value={result.status} />
                </PageHeader>
                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard title="Score" value={`${result.score} / ${result.max_score}`} />
                    <StatCard title="Pourcentage" value={`${result.percentage} %`} />
                    <StatCard title="Qualification" value={result.qualified ? 'Qualifié' : 'Non qualifié'} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Correction</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {corrections === null && <p className="text-muted-foreground">La correction sera disponible à la fermeture de l'examen.</p>}
                        {corrections?.map((c, index) => (
                            <div key={index} className="rounded-md border p-3">
                                <div className="flex justify-between font-medium">
                                    <span>{c.title}</span>
                                    <span>{c.is_correct ? 'Correct' : 'Incorrect'} - {c.points_awarded} pts</span>
                                </div>
                                {c.explanation && <p className="mt-1 text-muted-foreground">{c.explanation}</p>}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
