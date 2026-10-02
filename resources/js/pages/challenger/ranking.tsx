import { NativeSelect } from '@/components/contest/native-select';
import { PageHeader } from '@/components/contest/page-header';
import { type ContestRef, type Ref } from '@/components/contest/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDuration } from '@/lib/format';
import { Head, router } from '@inertiajs/react';

interface Props {
    ranking: { rank: number; name: string; total_score: number; total_duration: number; is_me: boolean }[];
    contests: ContestRef[];
    contest: ContestRef | null;
    category: Ref | null;
}

export default function ChallengerRanking({ ranking, contests, contest, category }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Classement', href: '/challenger/ranking' }]}>
            <Head title="Classement" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Classement" description={category ? `Catégorie ${category.name}` : undefined}>
                    {contests.length > 1 && (
                        <NativeSelect value={contest?.id ?? ''} onChange={(e) => router.get('/challenger/ranking', { contest: e.target.value })}>
                            {contests.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} {c.year}
                                </option>
                            ))}
                        </NativeSelect>
                    )}
                </PageHeader>
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rang</TableHead>
                                    <TableHead>Candidat</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Temps utilisé</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ranking.map((r) => (
                                    <TableRow key={r.rank + r.name} className={r.is_me ? 'bg-muted font-semibold' : ''}>
                                        <TableCell>#{r.rank}</TableCell>
                                        <TableCell>{r.name}{r.is_me ? ' (moi)' : ''}</TableCell>
                                        <TableCell>{r.total_score}</TableCell>
                                        <TableCell>{formatDuration(r.total_duration)}</TableCell>
                                    </TableRow>
                                ))}
                                {ranking.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                            Le classement n'est pas encore disponible.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
