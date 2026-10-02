import { NativeSelect } from '@/components/contest/native-select';
import { PageHeader } from '@/components/contest/page-header';
import { StatCard } from '@/components/contest/stat-card';
import { StatusBadge } from '@/components/contest/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate, label } from '@/lib/format';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface ChallengeRow {
    id: number;
    title: string;
    points: number;
    topic: string | null;
    difficulty: string;
    pivot?: { points: number | null };
}

interface Props {
    exam: {
        id: number;
        name: string;
        description: string | null;
        status: string;
        duration_minutes: number;
        start_at: string | null;
        end_at: string | null;
        max_attempts: number;
        passing_score: number;
        has_attempts: boolean;
        max_score: number;
        contest: { id: number; name: string; year: number };
        categories: { id: number; name: string }[];
        challenges: ChallengeRow[];
    };
    availableChallenges: ChallengeRow[];
    prefix: string;
}

export default function ExamShow({ exam, availableChallenges, prefix }: Props) {
    const { auth } = usePage<SharedData>().props;
    const canEdit = auth.permissions.includes('exams.edit');
    const base = `/${prefix}/exams`;
    const [selected, setSelected] = useState<{ id: number; points: string }[]>(
        exam.challenges.map((c) => ({ id: c.id, points: c.pivot?.points != null ? String(c.pivot.points) : '' })),
    );
    const [toAdd, setToAdd] = useState('');

    const titleOf = (id: number) => availableChallenges.find((c) => c.id === id)?.title ?? exam.challenges.find((c) => c.id === id)?.title ?? `#${id}`;
    const defaultPoints = (id: number) => availableChallenges.find((c) => c.id === id)?.points ?? exam.challenges.find((c) => c.id === id)?.points ?? 0;

    const add = () => {
        const id = Number(toAdd);
        if (id && !selected.some((s) => s.id === id)) setSelected([...selected, { id, points: '' }]);
        setToAdd('');
    };

    const save = () =>
        router.put(`${base}/${exam.id}/challenges`, {
            challenges: selected.map((s) => ({ id: s.id, points: s.points === '' ? null : Number(s.points) })),
        });

    const move = (index: number, direction: number) => {
        const list = [...selected];
        const target = index + direction;
        if (target < 0 || target >= list.length) return;
        [list[index], list[target]] = [list[target], list[index]];
        setSelected(list);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Examens', href: base }, { title: exam.name, href: '#' }]}>
            <Head title={exam.name} />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title={exam.name} description={`${exam.contest.name} ${exam.contest.year}`}>
                    <StatusBadge value={exam.status} />
                    {canEdit && (
                        <Button asChild variant="outline">
                            <Link href={`${base}/${exam.id}/edit`}>Modifier</Link>
                        </Button>
                    )}
                </PageHeader>

                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard title="Durée" value={`${exam.duration_minutes} min`} />
                    <StatCard title="Tentatives max" value={exam.max_attempts} />
                    <StatCard title="Score maximum" value={exam.max_score} />
                    <StatCard title="Seuil de réussite" value={`${exam.passing_score} %`} />
                </div>

                <Card>
                    <CardContent className="space-y-1 pt-6 text-sm">
                        {exam.description && <p>{exam.description}</p>}
                        <p>Ouverture : {formatDate(exam.start_at)} - Fermeture : {formatDate(exam.end_at)}</p>
                        <p>Catégories : {exam.categories.map((c) => c.name).join(', ') || 'Toutes'}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Challenges de l'examen</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {exam.has_attempts && (
                            <p className="text-sm text-muted-foreground">Des tentatives existent : la composition de l'examen est figée.</p>
                        )}
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Titre</TableHead>
                                    <TableHead>Points (défaut)</TableHead>
                                    <TableHead>Points pour cet examen</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selected.map((s, index) => (
                                    <TableRow key={s.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{titleOf(s.id)}</TableCell>
                                        <TableCell>{defaultPoints(s.id)}</TableCell>
                                        <TableCell>
                                            <Input
                                                className="w-28"
                                                type="number"
                                                disabled={!canEdit || exam.has_attempts}
                                                value={s.points}
                                                onChange={(e) => setSelected(selected.map((x) => (x.id === s.id ? { ...x, points: e.target.value } : x)))}
                                            />
                                        </TableCell>
                                        <TableCell className="space-x-1 text-right">
                                            {canEdit && !exam.has_attempts && (
                                                <>
                                                    <Button size="sm" variant="outline" onClick={() => move(index, -1)}>
                                                        Monter
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => move(index, 1)}>
                                                        Descendre
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => setSelected(selected.filter((x) => x.id !== s.id))}>
                                                        Retirer
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {selected.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                                            Aucun challenge.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {canEdit && !exam.has_attempts && (
                            <div className="flex flex-wrap items-center gap-2">
                                <NativeSelect value={toAdd} onChange={(e) => setToAdd(e.target.value)}>
                                    <option value="">Ajouter un challenge...</option>
                                    {availableChallenges
                                        .filter((c) => !selected.some((s) => s.id === c.id))
                                        .map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.title} ({c.points} pts{c.topic ? `, ${c.topic}` : ''}, {label(c.difficulty)})
                                            </option>
                                        ))}
                                </NativeSelect>
                                <Button variant="outline" onClick={add}>
                                    Ajouter
                                </Button>
                                <Button onClick={save}>Enregistrer la composition</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
