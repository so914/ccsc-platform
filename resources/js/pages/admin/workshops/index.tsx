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
import { Head, Link } from '@inertiajs/react';

interface Props {
    workshops: Paginator<{ id: number; title: string; starts_at: string; capacity: number; speaker_name: string | null; status: string; registrations_count: number }>;
    statuses: string[];
    filters: Record<string, string>;
}

export default function WorkshopsIndex({ workshops, statuses, filters }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Ateliers', href: '/admin/workshops' }]}>
            <Head title="Ateliers" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Ateliers" actionLabel="Nouvel atelier" actionHref="/admin/workshops/create" />
                <FilterBar
                    url="/admin/workshops"
                    filters={filters}
                    searchPlaceholder="Rechercher un atelier..."
                    selects={[{ name: 'status', placeholder: 'Tous les statuts', options: statuses.map((s) => ({ value: s, label: label(s) })) }]}
                />
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Titre</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Intervenant</TableHead>
                                    <TableHead>Inscrits</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {workshops.data.map((w) => (
                                    <TableRow key={w.id}>
                                        <TableCell className="font-medium">{w.title}</TableCell>
                                        <TableCell>{formatDate(w.starts_at)}</TableCell>
                                        <TableCell>{w.speaker_name ?? '-'}</TableCell>
                                        <TableCell>{w.registrations_count} / {w.capacity}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={w.status} />
                                        </TableCell>
                                        <TableCell className="space-x-2 text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/admin/workshops/${w.id}`}>Ouvrir</Link>
                                            </Button>
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/admin/workshops/${w.id}/edit`}>Modifier</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {workshops.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                            Aucun atelier.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <DataTablePagination data={workshops} />
            </div>
        </AppLayout>
    );
}
