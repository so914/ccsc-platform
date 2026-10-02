import { PageHeader } from '@/components/contest/page-header';
import { StatusBadge } from '@/components/contest/status-badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import { Head } from '@inertiajs/react';

interface Props {
    participations: { id: number; status: string; registered_at: string | null; workshop: { title: string; starts_at: string; speaker_name: string | null } }[];
}

export default function Participations({ participations }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Mes participations', href: '/participant/participations' }]}>
            <Head title="Mes participations" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Mes participations" description="Historique de vos inscriptions aux ateliers." />
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Atelier</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Intervenant</TableHead>
                                    <TableHead>Inscription</TableHead>
                                    <TableHead>Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {participations.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium">{p.workshop.title}</TableCell>
                                        <TableCell>{formatDate(p.workshop.starts_at)}</TableCell>
                                        <TableCell>{p.workshop.speaker_name ?? '-'}</TableCell>
                                        <TableCell>{formatDate(p.registered_at)}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={p.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {participations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                            Aucune participation.
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
