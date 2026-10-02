import { FilterBar } from '@/components/contest/filter-bar';
import { PageHeader } from '@/components/contest/page-header';
import { StatusBadge } from '@/components/contest/status-badge';
import { type Paginator } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate, label } from '@/lib/format';
import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Contest {
    id: number;
    name: string;
    year: number;
    status: string;
    start_at: string | null;
    end_at: string | null;
    participants_count: number;
    exams_count: number;
}

interface Props {
    contests: Paginator<Contest>;
    filters: Record<string, string>;
    statuses: string[];
    prefix: string;
}

export default function ContestsIndex({ contests, filters, statuses, prefix }: Props) {
    const { auth } = usePage<SharedData>().props;
    const canCreate = auth.permissions.includes('contests.create');
    const canEdit = auth.permissions.includes('contests.edit');
    const base = `/${prefix}/contests`;

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Concours', href: base }]}>
            <Head title="Concours" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader
                    title="Concours"
                    description="Chaque édition est conservée dans les archives."
                    actionLabel={canCreate ? 'Nouveau concours' : undefined}
                    actionHref={`${base}/create`}
                />

                <FilterBar
                    url={base}
                    filters={filters}
                    searchPlaceholder="Rechercher un concours..."
                    selects={[{ name: 'status', placeholder: 'Tous les statuts', options: statuses.map((s) => ({ value: s, label: label(s) })) }]}
                />

                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Année</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Début</TableHead>
                                    <TableHead>Inscrits</TableHead>
                                    <TableHead>Examens</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contests.data.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.name}</TableCell>
                                        <TableCell>{c.year}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={c.status} />
                                        </TableCell>
                                        <TableCell>{formatDate(c.start_at)}</TableCell>
                                        <TableCell>{c.participants_count}</TableCell>
                                        <TableCell>{c.exams_count}</TableCell>
                                        <TableCell className="space-x-2 text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`${base}/${c.id}`}>Ouvrir</Link>
                                            </Button>
                                            {canEdit && (
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`${base}/${c.id}/edit`}>Modifier</Link>
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {contests.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                            Aucun concours.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <DataTablePagination data={contests} />
            </div>
        </AppLayout>
    );
}
