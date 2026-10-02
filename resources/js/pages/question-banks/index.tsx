import { FilterBar } from '@/components/contest/filter-bar';
import { PageHeader } from '@/components/contest/page-header';
import { type Paginator } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Props {
    banks: Paginator<{ id: number; name: string; description: string | null; challenges_count: number }>;
    filters: Record<string, string>;
    prefix: string;
}

export default function QuestionBanksIndex({ banks, filters, prefix }: Props) {
    const { auth } = usePage<SharedData>().props;
    const base = `/${prefix}/question-banks`;

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Banques de questions', href: base }]}>
            <Head title="Banques de questions" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader
                    title="Banques de questions"
                    description="Réutilisables d'une édition à l'autre."
                    actionLabel={auth.permissions.includes('question-banks.create') ? 'Nouvelle banque' : undefined}
                    actionHref={`${base}/create`}
                />
                <FilterBar url={base} filters={filters} searchPlaceholder="Rechercher une banque..." />
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Challenges</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {banks.data.map((b) => (
                                    <TableRow key={b.id}>
                                        <TableCell className="font-medium">{b.name}</TableCell>
                                        <TableCell>{b.description ?? '-'}</TableCell>
                                        <TableCell>{b.challenges_count}</TableCell>
                                        <TableCell className="space-x-2 text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`${base}/${b.id}`}>Ouvrir</Link>
                                            </Button>
                                            {auth.permissions.includes('question-banks.edit') && (
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`${base}/${b.id}/edit`}>Modifier</Link>
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {banks.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                                            Aucune banque.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <DataTablePagination data={banks} />
            </div>
        </AppLayout>
    );
}
