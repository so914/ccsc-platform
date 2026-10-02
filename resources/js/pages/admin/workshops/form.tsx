import { FormField } from '@/components/form-field';
import { NativeSelect } from '@/components/contest/native-select';
import { PageHeader } from '@/components/contest/page-header';
import { type ContestRef } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { label, toInputDate } from '@/lib/format';
import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    workshop: {
        id: number;
        contest_id: number | null;
        title: string;
        description: string | null;
        starts_at: string;
        duration_minutes: number;
        capacity: number;
        speaker_name: string | null;
        status: string;
    } | null;
    contests: ContestRef[];
    statuses: string[];
}

export default function WorkshopForm({ workshop, contests, statuses }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        contest_id: workshop?.contest_id ? String(workshop.contest_id) : '',
        title: workshop?.title ?? '',
        description: workshop?.description ?? '',
        starts_at: toInputDate(workshop?.starts_at),
        duration_minutes: workshop?.duration_minutes ?? 60,
        capacity: workshop?.capacity ?? 30,
        speaker_name: workshop?.speaker_name ?? '',
        status: workshop?.status ?? 'draft',
    });
    const title = workshop ? "Modifier l'atelier" : 'Nouvel atelier';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (workshop) put(`/admin/workshops/${workshop.id}`);
        else post('/admin/workshops');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Ateliers', href: '/admin/workshops' }, { title, href: '#' }]}>
            <Head title={title} />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title={title} />
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Titre" error={errors.title} required>
                                    <Input value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                </FormField>
                                <FormField label="Intervenant" error={errors.speaker_name}>
                                    <Input value={data.speaker_name} onChange={(e) => setData('speaker_name', e.target.value)} />
                                </FormField>
                            </div>
                            <FormField label="Description" error={errors.description}>
                                <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </FormField>
                            <div className="grid gap-4 md:grid-cols-4">
                                <FormField label="Date et heure" error={errors.starts_at} required>
                                    <Input type="datetime-local" value={data.starts_at} onChange={(e) => setData('starts_at', e.target.value)} />
                                </FormField>
                                <FormField label="Durée (minutes)" error={errors.duration_minutes}>
                                    <Input type="number" value={data.duration_minutes} onChange={(e) => setData('duration_minutes', Number(e.target.value))} />
                                </FormField>
                                <FormField label="Capacité" error={errors.capacity}>
                                    <Input type="number" value={data.capacity} onChange={(e) => setData('capacity', Number(e.target.value))} />
                                </FormField>
                                <FormField label="Statut" error={errors.status}>
                                    <NativeSelect value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                        {statuses.map((s) => (
                                            <option key={s} value={s}>
                                                {label(s)}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </FormField>
                            </div>
                            <FormField label="Concours lié (facultatif)" error={errors.contest_id}>
                                <NativeSelect value={data.contest_id} onChange={(e) => setData('contest_id', e.target.value)}>
                                    <option value="">Aucun</option>
                                    {contests.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name} {c.year}
                                        </option>
                                    ))}
                                </NativeSelect>
                            </FormField>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    Enregistrer
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/admin/workshops">Annuler</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
