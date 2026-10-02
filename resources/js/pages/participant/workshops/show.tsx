import { PageHeader } from '@/components/contest/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import { Head, router } from '@inertiajs/react';

interface Props {
    workshop: {
        id: number;
        title: string;
        description: string | null;
        starts_at: string;
        duration_minutes: number;
        capacity: number;
        speaker_name: string | null;
        registrations_count: number;
    };
    registered: boolean;
    resources: { id: number; name: string; url: string }[];
}

export default function ParticipantWorkshopShow({ workshop, registered, resources }: Props) {
    const full = workshop.registrations_count >= workshop.capacity;

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Mes ateliers', href: '/participant/workshops' }, { title: workshop.title, href: '#' }]}>
            <Head title={workshop.title} />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title={workshop.title} description={`${formatDate(workshop.starts_at)} - ${workshop.duration_minutes} min`}>
                    {registered ? (
                        <Button variant="outline" onClick={() => router.delete(`/participant/workshops/${workshop.id}/register`, { preserveScroll: true })}>
                            Annuler mon inscription
                        </Button>
                    ) : (
                        <Button disabled={full} onClick={() => router.post(`/participant/workshops/${workshop.id}/register`, {}, { preserveScroll: true })}>
                            {full ? 'Complet' : "S'inscrire"}
                        </Button>
                    )}
                </PageHeader>
                <Card>
                    <CardContent className="space-y-2 pt-6 text-sm">
                        <p>{workshop.description}</p>
                        <p>Intervenant : {workshop.speaker_name ?? '-'}</p>
                        <p>Places : {workshop.registrations_count} / {workshop.capacity}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Ressources</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        {!registered && <p className="text-muted-foreground">Inscrivez-vous pour accéder aux ressources.</p>}
                        {registered && resources.length === 0 && <p className="text-muted-foreground">Aucune ressource pour le moment.</p>}
                        {resources.map((r) => (
                            <a key={r.id} href={r.url} target="_blank" rel="noreferrer" className="block hover:underline">
                                {r.name}
                            </a>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
