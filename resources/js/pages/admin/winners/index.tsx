import { NativeSelect } from '@/components/contest/native-select';
import { PageHeader } from '@/components/contest/page-header';
import { type ContestRef, type Ref } from '@/components/contest/types';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

interface Props {
    finalists: { id: number; final_position: number; preselection_score: number; user: { name: string; email: string }; category: Ref }[];
    contests: ContestRef[];
    contest: ContestRef | null;
}

export default function WinnersIndex({ finalists, contests, contest }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Gagnants', href: '/admin/winners' }]}>
            <Head title="Gagnants" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Gagnants" description="Positions finales saisies depuis la page Finalistes.">
                    <NativeSelect value={contest?.id ?? ''} onChange={(e) => router.get('/admin/winners', { contest: e.target.value })}>
                        {contests.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name} {c.year}
                            </option>
                        ))}
                    </NativeSelect>
                </PageHeader>
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Position</TableHead>
                                    <TableHead>Candidat</TableHead>
                                    <TableHead>Catégorie</TableHead>
                                    <TableHead>Score présélection</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {finalists.map((f) => (
                                    <TableRow key={f.id}>
                                        <TableCell className="font-bold">{f.final_position === 1 ? '1er' : `${f.final_position}e`}</TableCell>
                                        <TableCell className="font-medium">{f.user.name}</TableCell>
                                        <TableCell>{f.category.name}</TableCell>
                                        <TableCell>{f.preselection_score}</TableCell>
                                    </TableRow>
                                ))}
                                {finalists.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                            Aucun gagnant enregistré.
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
