import { FilterBar } from '@/components/contest/filter-bar';
import { PageHeader } from '@/components/contest/page-header';
import { StatusBadge } from '@/components/contest/status-badge';
import { type Paginator, type Ref } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { label } from '@/lib/format';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface Challenge {
    id: number;
    title: string;
    topic: string | null;
    difficulty: string;
    points: number;
    answer_type: string;
    status: string;
    bank: Ref;
}

interface Props {
    challenges: Paginator<Challenge>;
    banks: Ref[];
    filters: Record<string, string>;
    prefix: string;
}

export default function ChallengesIndex({ challenges, banks, filters, prefix }: Props) {
    const { auth } = usePage<SharedData>().props;
    const base = `/${prefix}/challenges`;

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Challenges', href: base }]}>
            <Head title="Challenges" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader
                    title="Challenges"
                    actionLabel={auth.permissions.includes('challenges.create') ? 'Nouveau challenge' : undefined}
                    actionHref={`${base}/create`}
                />

                <FilterBar
                    url={base}
                    filters={filters}
                    searchPlaceholder="Rechercher un challenge..."
                    selects={[{ name: 'bank', placeholder: 'Toutes les banques', options: banks.map((b) => ({ value: b.id, label: b.name })) }]}
                />

                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Titre</TableHead>
                                    <TableHead>Banque</TableHead>
                                    <TableHead>Domaine</TableHead>
                                    <TableHead>Difficulté</TableHead>
                                    <TableHead>Points</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {challenges.data.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.title}</TableCell>
                                        <TableCell>{c.bank.name}</TableCell>
                                        <TableCell>{c.topic ?? '-'}</TableCell>
                                        <TableCell>{label(c.difficulty)}</TableCell>
                                        <TableCell>{c.points}</TableCell>
                                        <TableCell>{label(c.answer_type)}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={c.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {auth.permissions.includes('challenges.edit') && (
                                                <Button asChild variant="outline" size="sm">
                                                    <Link href={`${base}/${c.id}/edit`}>Modifier</Link>
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {challenges.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                                            Aucun challenge.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <DataTablePagination data={challenges} />
            </div>
        </AppLayout>
    );
}
