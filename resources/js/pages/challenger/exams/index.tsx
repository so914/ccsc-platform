import { PageHeader } from '@/components/contest/page-header';
import { StatusBadge } from '@/components/contest/status-badge';
import { type ContestRef } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import { Head, Link } from '@inertiajs/react';

interface Exam {
    id: number;
    name: string;
    status: string;
    duration_minutes: number;
    start_at: string | null;
    end_at: string | null;
    max_attempts: number;
    challenges_count: number;
    attempts_used: number;
    in_progress: boolean;
    contest: ContestRef;
}

function ExamTable({ exams, empty, action }: { exams: Exam[]; empty: string; action: string }) {
    return (
        <Card>
            <CardContent className="pt-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Examen</TableHead>
                            <TableHead>Concours</TableHead>
                            <TableHead>Fermeture</TableHead>
                            <TableHead>Durée</TableHead>
                            <TableHead>Tentatives</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {exams.map((e) => (
                            <TableRow key={e.id}>
                                <TableCell className="font-medium">{e.name}</TableCell>
                                <TableCell>{e.contest.name} {e.contest.year}</TableCell>
                                <TableCell>{formatDate(e.end_at)}</TableCell>
                                <TableCell>{e.duration_minutes} min</TableCell>
                                <TableCell>{e.attempts_used} / {e.max_attempts}</TableCell>
                                <TableCell>
                                    <StatusBadge value={e.in_progress ? 'in_progress' : e.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={`/challenger/exams/${e.id}`}>{e.in_progress ? 'Reprendre' : action}</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {exams.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                    {empty}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default function ChallengerExams({ available, finished }: { available: Exam[]; finished: Exam[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Examens', href: '/challenger/exams' }]}>
            <Head title="Examens" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Examens disponibles" />
                <ExamTable exams={available} empty="Aucun examen disponible." action="Ouvrir" />
                <PageHeader title="Examens terminés" />
                <ExamTable exams={finished} empty="Aucun examen terminé." action="Détails" />
            </div>
        </AppLayout>
    );
}
