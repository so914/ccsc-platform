import { FilterBar } from '@/components/contest/filter-bar';
import { PageHeader } from '@/components/contest/page-header';
import { StatusBadge } from '@/components/contest/status-badge';
import { type Paginator, type Ref } from '@/components/contest/types';
import { Card, CardContent } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import { Head } from '@inertiajs/react';

interface Props {
    registrations: Paginator<{
        id: number;
        status: string;
        registered_at: string | null;
        user: { name: string; email: string };
        workshop: { title: string; starts_at: string };
    }>;
    workshops: { id: number; title: string }[];
    filters: Record<string, string>;
}

export default function WorkshopRegistrations({ registrations, workshops, filters }: Props) {
    const options: Ref[] = workshops.map((w) => ({ id: w.id, name: w.title }));

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Inscriptions aux ateliers', href: '/admin/workshop-registrations' }]}>
            <Head title="Inscriptions aux ateliers" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Inscriptions aux ateliers" />
                <FilterBar
                    url="/admin/workshop-registrations"
                    filters={filters}
                    selects={[{ name: 'workshop', placeholder: 'Tous les ateliers', options: options.map((o) => ({ value: o.id, label: o.name })) }]}
                />
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Participant</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Atelier</TableHead>
                                    <TableHead>Date de l'atelier</TableHead>
                                    <TableHead>Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {registrations.data.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-medium">{r.user.name}</TableCell>
                                        <TableCell>{r.user.email}</TableCell>
                                        <TableCell>{r.workshop.title}</TableCell>
                                        <TableCell>{formatDate(r.workshop.starts_at)}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={r.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {registrations.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                            Aucune inscription.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <DataTablePagination data={registrations} />
            </div>
        </AppLayout>
    );
}
