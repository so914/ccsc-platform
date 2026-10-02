import { PageHeader } from '@/components/contest/page-header';
import { StatusBadge } from '@/components/contest/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import { Head, Link, router, useForm } from '@inertiajs/react';

interface Props {
    workshop: {
        id: number;
        title: string;
        description: string | null;
        starts_at: string;
        duration_minutes: number;
        capacity: number;
        speaker_name: string | null;
        status: string;
        registrations: { id: number; status: string; registered_at: string | null; user: { name: string; email: string } }[];
    };
    resources: { id: number; name: string; url: string }[];
}

export default function WorkshopShow({ workshop, resources }: Props) {
    const upload = useForm<{ file: File | null }>({ file: null });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        upload.post(`/admin/workshops/${workshop.id}/resources`, { forceFormData: true, onSuccess: () => upload.reset() });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Ateliers', href: '/admin/workshops' }, { title: workshop.title, href: '#' }]}>
            <Head title={workshop.title} />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title={workshop.title} description={`${formatDate(workshop.starts_at)} - ${workshop.duration_minutes} min - ${workshop.speaker_name ?? 'Intervenant à définir'}`}>
                    <StatusBadge value={workshop.status} />
                    <Button asChild variant="outline">
                        <Link href={`/admin/workshops/${workshop.id}/edit`}>Modifier</Link>
                    </Button>
                </PageHeader>

                {workshop.description && (
                    <Card>
                        <CardContent className="pt-6 text-sm">{workshop.description}</CardContent>
                    </Card>
                )}

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inscrits ({workshop.registrations.filter((r) => r.status === 'registered').length} / {workshop.capacity})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Statut</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {workshop.registrations.map((r) => (
                                        <TableRow key={r.id}>
                                            <TableCell>{r.user.name}</TableCell>
                                            <TableCell>{r.user.email}</TableCell>
                                            <TableCell>
                                                <StatusBadge value={r.status} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ressources</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <form onSubmit={submit} className="flex items-center gap-2">
                                <Input type="file" onChange={(e) => upload.setData('file', e.target.files?.[0] ?? null)} />
                                <Button type="submit" disabled={upload.processing || !upload.data.file}>
                                    Ajouter
                                </Button>
                            </form>
                            {upload.errors.file && <p className="text-sm text-destructive">{upload.errors.file}</p>}
                            {resources.map((r) => (
                                <div key={r.id} className="flex items-center justify-between text-sm">
                                    <a className="hover:underline" href={r.url} target="_blank" rel="noreferrer">
                                        {r.name}
                                    </a>
                                    <Button size="sm" variant="outline" onClick={() => router.delete(`/admin/workshops/${workshop.id}/resources/${r.id}`, { preserveScroll: true })}>
                                        Retirer
                                    </Button>
                                </div>
                            ))}
                            {resources.length === 0 && <p className="text-sm text-muted-foreground">Aucune ressource.</p>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
