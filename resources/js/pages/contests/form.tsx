import { FormField } from '@/components/form-field';
import { NativeSelect } from '@/components/contest/native-select';
import { PageHeader } from '@/components/contest/page-header';
import { type Ref } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { label, toInputDate } from '@/lib/format';
import { Head, Link, useForm } from '@inertiajs/react';

interface ContestData {
    id: number;
    name: string;
    description: string | null;
    year: number;
    registration_start_at: string | null;
    registration_end_at: string | null;
    start_at: string | null;
    end_at: string | null;
    status: string;
    tie_breakers: string[] | null;
    categories: { id: number }[];
    agents: { id: number }[];
}

interface Props {
    contest: ContestData | null;
    categories: Ref[];
    agents: Ref[];
    statuses: string[];
    tieBreakers: string[];
}

export default function ContestForm({ contest, categories, agents, statuses, tieBreakers }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: contest?.name ?? '',
        description: contest?.description ?? '',
        year: contest?.year ?? new Date().getFullYear(),
        registration_start_at: toInputDate(contest?.registration_start_at),
        registration_end_at: toInputDate(contest?.registration_end_at),
        start_at: toInputDate(contest?.start_at),
        end_at: toInputDate(contest?.end_at),
        status: contest?.status ?? 'draft',
        tie_breakers: contest?.tie_breakers ?? tieBreakers,
        category_ids: contest?.categories.map((c) => c.id) ?? ([] as number[]),
        agent_ids: contest?.agents.map((a) => a.id) ?? ([] as number[]),
    });

    const toggle = (field: 'category_ids' | 'agent_ids', id: number) => {
        const current = data[field];
        setData(field, current.includes(id) ? current.filter((v) => v !== id) : [...current, id]);
    };

    const moveBreaker = (index: number, direction: number) => {
        const list = [...data.tie_breakers];
        const target = index + direction;
        if (target < 0 || target >= list.length) return;
        [list[index], list[target]] = [list[target], list[index]];
        setData('tie_breakers', list);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (contest) put(`/admin/contests/${contest.id}`);
        else post('/admin/contests');
    };

    const title = contest ? 'Modifier le concours' : 'Nouveau concours';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Tableau de bord', href: '/dashboard' },
                { title: 'Concours', href: '/admin/contests' },
                { title, href: '#' },
            ]}
        >
            <Head title={title} />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title={title} />
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Nom" htmlFor="name" error={errors.name} required>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                </FormField>
                                <FormField label="Année" htmlFor="year" error={errors.year} required>
                                    <Input id="year" type="number" value={data.year} onChange={(e) => setData('year', Number(e.target.value))} />
                                </FormField>
                            </div>

                            <FormField label="Description" htmlFor="description" error={errors.description}>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </FormField>

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Début des inscriptions" error={errors.registration_start_at}>
                                    <Input type="datetime-local" value={data.registration_start_at} onChange={(e) => setData('registration_start_at', e.target.value)} />
                                </FormField>
                                <FormField label="Fin des inscriptions" error={errors.registration_end_at}>
                                    <Input type="datetime-local" value={data.registration_end_at} onChange={(e) => setData('registration_end_at', e.target.value)} />
                                </FormField>
                                <FormField label="Début du concours" error={errors.start_at}>
                                    <Input type="datetime-local" value={data.start_at} onChange={(e) => setData('start_at', e.target.value)} />
                                </FormField>
                                <FormField label="Fin du concours" error={errors.end_at}>
                                    <Input type="datetime-local" value={data.end_at} onChange={(e) => setData('end_at', e.target.value)} />
                                </FormField>
                            </div>

                            <FormField label="Statut" error={errors.status} required>
                                <NativeSelect value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                    {statuses.map((s) => (
                                        <option key={s} value={s}>
                                            {label(s)}
                                        </option>
                                    ))}
                                </NativeSelect>
                            </FormField>

                            <FormField label="Catégories acceptées" error={errors.category_ids}>
                                <div className="flex flex-wrap gap-4">
                                    {categories.map((c) => (
                                        <label key={c.id} className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" checked={data.category_ids.includes(c.id)} onChange={() => toggle('category_ids', c.id)} />
                                            {c.name}
                                        </label>
                                    ))}
                                    {categories.length === 0 && <span className="text-sm text-muted-foreground">Créez d'abord des catégories.</span>}
                                </div>
                            </FormField>

                            <FormField label="Agents affectés" error={errors.agent_ids}>
                                <div className="flex flex-wrap gap-4">
                                    {agents.map((a) => (
                                        <label key={a.id} className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" checked={data.agent_ids.includes(a.id)} onChange={() => toggle('agent_ids', a.id)} />
                                            {a.name}
                                        </label>
                                    ))}
                                    {agents.length === 0 && <span className="text-sm text-muted-foreground">Aucun agent disponible.</span>}
                                </div>
                            </FormField>

                            <FormField label="Ordre de départage du classement" help="Appliqué dans cet ordre en cas d'égalité de score.">
                                <ol className="space-y-1">
                                    {data.tie_breakers.map((rule, index) => (
                                        <li key={rule} className="flex items-center gap-2 text-sm">
                                            <span className="w-6 text-muted-foreground">{index + 1}.</span>
                                            <span className="w-48">{label(rule)}</span>
                                            <Button type="button" variant="outline" size="sm" onClick={() => moveBreaker(index, -1)}>
                                                Monter
                                            </Button>
                                            <Button type="button" variant="outline" size="sm" onClick={() => moveBreaker(index, 1)}>
                                                Descendre
                                            </Button>
                                        </li>
                                    ))}
                                </ol>
                            </FormField>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    Enregistrer
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/admin/contests">Annuler</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
