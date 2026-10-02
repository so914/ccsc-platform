import { FilterBar } from '@/components/contest/filter-bar';
import { PageHeader } from '@/components/contest/page-header';
import { StatusBadge } from '@/components/contest/status-badge';
import { type ContestRef, type Paginator, type Ref } from '@/components/contest/types';
import { Card, CardContent } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import { Head } from '@inertiajs/react';

interface Row {
    id: number;
    status: string;
    registered_at: string | null;
    user: { id: number; name: string; email: string };
    contest: ContestRef;
    category: Ref;
}

interface Props {
    participants: Paginator<Row>;
    contests: ContestRef[];
    categories: Ref[];
    filters: Record<string, string>;
    prefix: string;
}

export default function ChallengersIndex({ participants, contests, categories, filters, prefix }: Props) {
    const base = `/${prefix}/challengers`;

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Challengers', href: base }]}>
            <Head title="Challengers" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Challengers" description="Candidats inscrits, par édition." />
                <FilterBar
                    url={base}
                    filters={filters}
                    searchPlaceholder="Nom ou email..."
                    selects={[
                        { name: 'contest', placeholder: 'Tous les concours', options: contests.map((c) => ({ value: c.id, label: `${c.name} ${c.year}` })) },
                        { name: 'category', placeholder: 'Toutes les catégories', options: categories.map((c) => ({ value: c.id, label: c.name })) },
                    ]}
                />
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Concours</TableHead>
                                    <TableHead>Catégorie</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Inscription</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {participants.data.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.user.name}</TableCell>
                                        <TableCell>{p.user.email}</TableCell>
                                        <TableCell>{p.contest.name} {p.contest.year}</TableCell>
                                        <TableCell>{p.category.name}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={p.status} />
                                        </TableCell>
                                        <TableCell>{formatDate(p.registered_at)}</TableCell>
                                    </TableRow>
                                ))}
                                {participants.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                            Aucun challenger.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <DataTablePagination data={participants} />
            </div>
        </AppLayout>
    );
}
