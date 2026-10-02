import { NativeSelect } from '@/components/contest/native-select';
import { PageHeader } from '@/components/contest/page-header';
import { type ContestRef, type Ref } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { label } from '@/lib/format';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Finalist {
    id: number;
    preselection_rank: number | null;
    preselection_score: number;
    status: string;
    final_position: number | null;
    user: { id: number; name: string; email: string };
    category: Ref;
}

interface Props {
    finalists: Finalist[];
    contests: ContestRef[];
    contest: ContestRef | null;
    categories: Ref[];
    statuses: string[];
}

function FinalistRow({ finalist, statuses }: { finalist: Finalist; statuses: string[] }) {
    const [status, setStatus] = useState(finalist.status);
    const [position, setPosition] = useState(finalist.final_position ? String(finalist.final_position) : '');

    const save = () =>
        router.put(`/admin/finalists/${finalist.id}`, { status, final_position: position === '' ? null : Number(position) }, { preserveScroll: true });

    return (
        <TableRow>
            <TableCell>#{finalist.preselection_rank}</TableCell>
            <TableCell className="font-medium">{finalist.user.name}</TableCell>
            <TableCell>{finalist.category.name}</TableCell>
            <TableCell>{finalist.preselection_score}</TableCell>
            <TableCell>
                <NativeSelect value={status} onChange={(e) => setStatus(e.target.value)}>
                    {statuses.map((s) => (
                        <option key={s} value={s}>
                            {label(s)}
                        </option>
                    ))}
                </NativeSelect>
            </TableCell>
            <TableCell>
                <Input className="w-24" type="number" placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} />
            </TableCell>
            <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={save}>
                    Enregistrer
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default function FinalistsIndex({ finalists, contests, contest, categories, statuses }: Props) {
    const form = useForm({ contest_id: contest?.id ?? '', count: 10, category_id: '' });

    const qualify = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/finalists/qualify', { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Finalistes', href: '/admin/finalists' }]}>
            <Head title="Finalistes" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Finalistes" description="Qualifiés à partir du classement de présélection.">
                    <NativeSelect value={contest?.id ?? ''} onChange={(e) => router.get('/admin/finalists', { contest: e.target.value })}>
                        {contests.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name} {c.year}
                            </option>
                        ))}
                    </NativeSelect>
                </PageHeader>

                <Card>
                    <CardHeader>
                        <CardTitle>Qualifier les meilleurs candidats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={qualify} className="flex flex-wrap items-center gap-2">
                            <span className="text-sm">Les</span>
                            <Input className="w-24" type="number" value={form.data.count} onChange={(e) => form.setData('count', Number(e.target.value))} />
                            <span className="text-sm">premiers de</span>
                            <NativeSelect value={form.data.category_id} onChange={(e) => form.setData('category_id', e.target.value)}>
                                <option value="">chaque catégorie</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </NativeSelect>
                            <Button type="submit" disabled={form.processing || !contest}>
                                Qualifier
                            </Button>
                        </form>
                        {Object.values(form.errors).map((m) => (
                            <p key={m} className="mt-2 text-sm text-destructive">
                                {m}
                            </p>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rang présélection</TableHead>
                                    <TableHead>Candidat</TableHead>
                                    <TableHead>Catégorie</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Position finale</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {finalists.map((f) => (
                                    <FinalistRow key={`${f.id}-${f.status}-${f.final_position}`} finalist={f} statuses={statuses} />
                                ))}
                                {finalists.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                            Aucun finaliste.
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
