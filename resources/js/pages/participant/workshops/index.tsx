import { PageHeader } from '@/components/contest/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import { Head, Link, router } from '@inertiajs/react';

interface Workshop {
    id: number;
    title: string;
    description: string | null;
    starts_at: string;
    duration_minutes: number;
    capacity: number;
    speaker_name: string | null;
    registrations_count: number;
    registered: boolean;
}

export default function ParticipantWorkshops({ workshops }: { workshops: Workshop[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Mes ateliers', href: '/participant/workshops' }]}>
            <Head title="Ateliers" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Ateliers" description="Inscrivez-vous aux ateliers publiés." />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {workshops.map((w) => (
                        <Card key={w.id}>
                            <CardHeader>
                                <CardTitle>{w.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p className="text-muted-foreground">{w.description}</p>
                                <p>{formatDate(w.starts_at)} - {w.duration_minutes} min</p>
                                <p>Intervenant : {w.speaker_name ?? '-'}</p>
                                <p>Places : {w.registrations_count} / {w.capacity}</p>
                                <div className="flex gap-2 pt-2">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/participant/workshops/${w.id}`}>Détails</Link>
                                    </Button>
                                    {w.registered ? (
                                        <Button size="sm" variant="outline" onClick={() => router.delete(`/participant/workshops/${w.id}/register`, { preserveScroll: true })}>
                                            Annuler mon inscription
                                        </Button>
                                    ) : (
                                        <Button size="sm" disabled={w.registrations_count >= w.capacity} onClick={() => router.post(`/participant/workshops/${w.id}/register`, {}, { preserveScroll: true })}>
                                            {w.registrations_count >= w.capacity ? 'Complet' : "S'inscrire"}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {workshops.length === 0 && <p className="text-sm text-muted-foreground">Aucun atelier publié.</p>}
                </div>
            </div>
        </AppLayout>
    );
}
