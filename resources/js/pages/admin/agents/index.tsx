import { FilterBar } from '@/components/contest/filter-bar';
import { PageHeader } from '@/components/contest/page-header';
import { type Paginator } from '@/components/contest/types';
import { Card, CardContent } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Props {
    agents: Paginator<{ id: number; name: string; email: string; managed_contests: { id: number; name: string; year: number }[] }>;
    filters: Record<string, string>;
}

export default function AgentsIndex({ agents, filters }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Agents', href: '/admin/agents' }]}>
            <Head title="Agents" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader
                    title="Agents"
                    description="Pour créer un agent, créez un utilisateur avec le rôle agent, puis affectez-le à un concours."
                    actionLabel="Créer un utilisateur"
                    actionHref="/admin/users/create"
                />
                <FilterBar url="/admin/agents" filters={filters} searchPlaceholder="Nom ou email..." />
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Concours affectés</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {agents.data.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell className="font-medium">{a.name}</TableCell>
                                        <TableCell>{a.email}</TableCell>
                                        <TableCell>{a.managed_contests.map((c) => `${c.name} ${c.year}`).join(', ') || '-'}</TableCell>
                                    </TableRow>
                                ))}
                                {agents.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                                            Aucun agent.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <DataTablePagination data={agents} />
            </div>
        </AppLayout>
    );
}
