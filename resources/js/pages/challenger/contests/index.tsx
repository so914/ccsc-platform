import { NativeSelect } from '@/components/contest/native-select';
import { PageHeader } from '@/components/contest/page-header';
import { StatusBadge } from '@/components/contest/status-badge';
import { type Ref } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/format';
import { Head, useForm } from '@inertiajs/react';

interface Contest {
    id: number;
    name: string;
    description: string | null;
    year: number;
    status: string;
    registration_start_at: string | null;
    registration_end_at: string | null;
    start_at: string | null;
    end_at: string | null;
    exams_count: number;
    categories: Ref[];
    registration_open: boolean;
    participation: { status: string; category: Ref } | null;
}

function ContestCard({ contest }: { contest: Contest }) {
    const form = useForm({ category_id: '' });

    const register = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/challenger/contests/${contest.id}/register`, { preserveScroll: true });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>
                        {contest.name} {contest.year}
                    </span>
                    <StatusBadge value={contest.status} />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                {contest.description && <p className="text-muted-foreground">{contest.description}</p>}
                <p>Inscriptions : {formatDate(contest.registration_start_at)} - {formatDate(contest.registration_end_at)}</p>
                <p>Concours : {formatDate(contest.start_at)} - {formatDate(contest.end_at)}</p>
                <p>{contest.exams_count} examen(s)</p>

                {contest.participation ? (
                    <p className="font-medium">
                        Vous êtes inscrit en catégorie {contest.participation.category.name} (<StatusBadge value={contest.participation.status} />)
                    </p>
                ) : contest.registration_open ? (
                    <form onSubmit={register} className="flex flex-wrap items-center gap-2 pt-2">
                        <NativeSelect value={form.data.category_id} onChange={(e) => form.setData('category_id', e.target.value)}>
                            <option value="">Choisir ma catégorie...</option>
                            {contest.categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </NativeSelect>
                        <Button type="submit" disabled={form.processing || !form.data.category_id}>
                            S'inscrire
                        </Button>
                        {form.errors.category_id && <span className="text-destructive">{form.errors.category_id}</span>}
                    </form>
                ) : (
                    <p className="text-muted-foreground">Inscriptions fermées.</p>
                )}
            </CardContent>
        </Card>
    );
}

export default function ChallengerContests({ contests }: { contests: Contest[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Mon concours', href: '/challenger/contests' }]}>
            <Head title="Mon concours" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Mon concours" description="Vos éditions et les concours ouverts aux inscriptions." />
                <div className="grid gap-4 lg:grid-cols-2">
                    {contests.map((c) => (
                        <ContestCard key={c.id} contest={c} />
                    ))}
                    {contests.length === 0 && <p className="text-sm text-muted-foreground">Aucun concours disponible pour le moment.</p>}
                </div>
            </div>
        </AppLayout>
    );
}
