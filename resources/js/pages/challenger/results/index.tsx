import { PageHeader } from '@/components/contest/page-header';
import { StatusBadge } from '@/components/contest/status-badge';
import { type ContestRef, type Ref } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate, formatDuration } from '@/lib/format';
import { Head, Link } from '@inertiajs/react';

interface Props {
    results: {
        id: number;
        score: number;
        max_score: number;
        percentage: number;
        status: string;
        qualified: boolean;
        duration_seconds: number;
        submitted_at: string | null;
        exam: Ref;
        contest: ContestRef;
    }[];
    attempts: { id: number; attempt_number: number; submitted_at: string | null; score: number; status: string; exam: Ref }[];
}

export default function ChallengerResults({ results, attempts }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Mes résultats', href: '/challenger/results' }]}>
            <Head title="Mes résultats" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Mes résultats" />
                <Card>
                    <CardHeader>
                        <CardTitle>Meilleur résultat par examen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Concours</TableHead>
                                    <TableHead>Examen</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>%</TableHead>
                                    <TableHead>Durée</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell>{r.contest.name} {r.contest.year}</TableCell>
                                        <TableCell className="font-medium">{r.exam.name}</TableCell>
                                        <TableCell>{r.score} / {r.max_score}</TableCell>
                                        <TableCell>{r.percentage} %</TableCell>
                                        <TableCell>{formatDuration(r.duration_seconds)}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={r.status} />
                                        </TableCell>
                                        <TableCell>{formatDate(r.submitted_at)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/challenger/results/${r.id}`}>Détails</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {results.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                                            Aucun résultat.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Historique des tentatives</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Examen</TableHead>
                                    <TableHead>Tentative</TableHead>
                                    <TableHead>Soumission</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attempts.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell>{a.exam.name}</TableCell>
                                        <TableCell>{a.attempt_number}</TableCell>
                                        <TableCell>{formatDate(a.submitted_at)}</TableCell>
                                        <TableCell>{a.score}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={a.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
