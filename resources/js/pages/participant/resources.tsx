import { PageHeader } from '@/components/contest/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function ParticipantResources({ resources }: { resources: { id: number; name: string; url: string; workshop: string }[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Ressources', href: '/participant/resources' }]}>
            <Head title="Ressources" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Ressources" description="Documents des ateliers auxquels vous êtes inscrit." />
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fichier</TableHead>
                                    <TableHead>Atelier</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resources.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell>
                                            <a className="font-medium hover:underline" href={r.url} target="_blank" rel="noreferrer">
                                                {r.name}
                                            </a>
                                        </TableCell>
                                        <TableCell>{r.workshop}</TableCell>
                                    </TableRow>
                                ))}
                                {resources.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={2} className="py-8 text-center text-muted-foreground">
                                            Aucune ressource disponible.
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
