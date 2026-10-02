import { FilterBar } from '@/components/contest/filter-bar';
import { PageHeader } from '@/components/contest/page-header';
import { type Paginator } from '@/components/contest/types';
import { Card, CardContent } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Props {
    participants: Paginator<{ id: number; name: string; email: string; workshop_registrations_count: number }>;
    filters: Record<string, string>;
}

export default function ParticipantsIndex({ participants, filters }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Participants', href: '/admin/participants' }]}>
            <Head title="Participants" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Participants" description="Utilisateurs inscrits aux ateliers." />
                <FilterBar url="/admin/participants" filters={filters} searchPlaceholder="Nom ou email..." />
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Inscriptions aux ateliers</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {participants.data.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.name}</TableCell>
                                        <TableCell>{p.email}</TableCell>
                                        <TableCell>{p.workshop_registrations_count}</TableCell>
                                    </TableRow>
                                ))}
                                {participants.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                                            Aucun participant.
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
