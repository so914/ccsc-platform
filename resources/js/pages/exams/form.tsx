import { FormField } from '@/components/form-field';
import { NativeSelect } from '@/components/contest/native-select';
import { PageHeader } from '@/components/contest/page-header';
import { type ContestRef, type Ref } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { label, toInputDate } from '@/lib/format';
import { Head, Link, useForm } from '@inertiajs/react';

interface ExamData {
    id: number;
    contest_id: number;
    name: string;
    description: string | null;
    duration_minutes: number;
    start_at: string | null;
    end_at: string | null;
    status: string;
    max_attempts: number;
    passing_score: number;
    categories: { id: number }[];
}

interface Props {
    exam: ExamData | null;
    contests: ContestRef[];
    categories: Ref[];
    statuses: string[];
    prefix: string;
}

export default function ExamForm({ exam, contests, categories, statuses, prefix }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        contest_id: exam?.contest_id ?? contests[0]?.id ?? '',
        name: exam?.name ?? '',
        description: exam?.description ?? '',
        duration_minutes: exam?.duration_minutes ?? 60,
        start_at: toInputDate(exam?.start_at),
        end_at: toInputDate(exam?.end_at),
        status: exam?.status ?? 'draft',
        max_attempts: exam?.max_attempts ?? 1,
        passing_score: exam?.passing_score ?? 50,
        category_ids: exam?.categories.map((c) => c.id) ?? ([] as number[]),
    });

    const base = `/${prefix}/exams`;

    const toggle = (id: number) =>
        setData('category_ids', data.category_ids.includes(id) ? data.category_ids.filter((v) => v !== id) : [...data.category_ids, id]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (exam) put(`${base}/${exam.id}`);
        else post(base);
    };

    const title = exam ? "Modifier l'examen" : 'Nouvel examen';

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Examens', href: base }, { title, href: '#' }]}>
            <Head title={title} />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title={title} />
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Concours" error={errors.contest_id} required>
                                    <NativeSelect value={data.contest_id} onChange={(e) => setData('contest_id', Number(e.target.value))}>
                                        {contests.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} {c.year}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </FormField>
                                <FormField label="Nom" htmlFor="name" error={errors.name} required>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                </FormField>
                            </div>

                            <FormField label="Description" error={errors.description}>
                                <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </FormField>

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Ouverture" error={errors.start_at}>
                                    <Input type="datetime-local" value={data.start_at} onChange={(e) => setData('start_at', e.target.value)} />
                                </FormField>
                                <FormField label="Fermeture" error={errors.end_at}>
                                    <Input type="datetime-local" value={data.end_at} onChange={(e) => setData('end_at', e.target.value)} />
                                </FormField>
                            </div>

                            <div className="grid gap-4 md:grid-cols-4">
                                <FormField label="Durée (minutes)" error={errors.duration_minutes} required>
                                    <Input type="number" value={data.duration_minutes} onChange={(e) => setData('duration_minutes', Number(e.target.value))} />
                                </FormField>
                                <FormField label="Tentatives max" error={errors.max_attempts} required>
                                    <Input type="number" value={data.max_attempts} onChange={(e) => setData('max_attempts', Number(e.target.value))} />
                                </FormField>
                                <FormField label="Seuil de réussite (%)" error={errors.passing_score} required>
                                    <Input type="number" value={data.passing_score} onChange={(e) => setData('passing_score', Number(e.target.value))} />
                                </FormField>
                                <FormField label="Statut" error={errors.status} required>
                                    <NativeSelect value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                        {statuses.map((s) => (
                                            <option key={s} value={s}>
                                                {label(s)}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </FormField>
                            </div>

                            <FormField label="Catégories autorisées" help="Aucune case cochée : toutes les catégories du concours." error={errors.category_ids}>
                                <div className="flex flex-wrap gap-4">
                                    {categories.map((c) => (
                                        <label key={c.id} className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" checked={data.category_ids.includes(c.id)} onChange={() => toggle(c.id)} />
                                            {c.name}
                                        </label>
                                    ))}
                                </div>
                            </FormField>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    Enregistrer
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={base}>Annuler</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
