import { FilterBar } from '@/components/contest/filter-bar';
import { NativeSelect } from '@/components/contest/native-select';
import { PageHeader } from '@/components/contest/page-header';
import { type ContestRef, type Paginator, type Ref } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate, label } from '@/lib/format';
import { Head, router, useForm } from '@inertiajs/react';

interface Row {
    id: number;
    status: string;
    registered_at: string | null;
    user: { id: number; name: string; email: string };
    contest: ContestRef;
    category: Ref;
}

interface Props {
    registrations: Paginator<Row>;
    contests: (ContestRef & { categories: Ref[] })[];
    challengers: { id: number; name: string; email: string }[];
    statuses: string[];
    filters: Record<string, string>;
}

export default function RegistrationsIndex({ registrations, contests, challengers, statuses, filters }: Props) {
    const form = useForm({ user_id: '', contest_id: '', category_id: '' });
    const selected = contests.find((c) => String(c.id) === form.data.contest_id);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/registrations', { onSuccess: () => form.reset() });
    };

    const changeStatus = (id: number, status: string) => router.put(`/admin/registrations/${id}`, { status }, { preserveScroll: true });

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Inscriptions', href: '/admin/registrations' }]}>
            <Head title="Inscriptions" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Inscriptions aux concours" />

                <Card>
                    <CardHeader>
                        <CardTitle>Inscrire un challenger</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
                            <NativeSelect value={form.data.user_id} onChange={(e) => form.setData('user_id', e.target.value)}>
                                <option value="">Challenger...</option>
                                {challengers.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} ({u.email})
                                    </option>
                                ))}
                            </NativeSelect>
                            <NativeSelect value={form.data.contest_id} onChange={(e) => form.setData({ ...form.data, contest_id: e.target.value, category_id: '' })}>
                                <option value="">Concours...</option>
                                {contests.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} {c.year}
                                    </option>
                                ))}
                            </NativeSelect>
                            <NativeSelect value={form.data.category_id} onChange={(e) => form.setData('category_id', e.target.value)}>
                                <option value="">Catégorie...</option>
                                {selected?.categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </NativeSelect>
                            <Button type="submit" disabled={form.processing}>
                                Inscrire
                            </Button>
                        </form>
                        {Object.values(form.errors).map((message) => (
                            <p key={message} className="mt-2 text-sm text-destructive">
                                {message}
                            </p>
                        ))}
                    </CardContent>
                </Card>

                <FilterBar
                    url="/admin/registrations"
                    filters={filters}
                    selects={[
                        { name: 'contest', placeholder: 'Tous les concours', options: contests.map((c) => ({ value: c.id, label: `${c.name} ${c.year}` })) },
                        { name: 'status', placeholder: 'Tous les statuts', options: statuses.map((s) => ({ value: s, label: label(s) })) },
                    ]}
                />

                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Candidat</TableHead>
                                    <TableHead>Concours</TableHead>
                                    <TableHead>Catégorie</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {registrations.data.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-medium">{r.user.name}</TableCell>
                                        <TableCell>{r.contest.name} {r.contest.year}</TableCell>
                                        <TableCell>{r.category.name}</TableCell>
                                        <TableCell>{formatDate(r.registered_at)}</TableCell>
                                        <TableCell>
                                            <NativeSelect value={r.status} onChange={(e) => changeStatus(r.id, e.target.value)}>
                                                {statuses.map((s) => (
                                                    <option key={s} value={s}>
                                                        {label(s)}
                                                    </option>
                                                ))}
                                            </NativeSelect>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {registrations.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                            Aucune inscription.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <DataTablePagination data={registrations} />
            </div>
        </AppLayout>
    );
}
