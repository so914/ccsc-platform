import { FilterBar } from '@/components/contest/filter-bar';
import { PageHeader } from '@/components/contest/page-header';
import { StatusBadge } from '@/components/contest/status-badge';
import { type Paginator } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Props {
    categories: Paginator<{ id: number; name: string; description: string | null; active: boolean; contests_count: number }>;
    filters: Record<string, string>;
}

export default function CategoriesIndex({ categories, filters }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Catégories', href: '/admin/categories' }]}>
            <Head title="Catégories" />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title="Catégories" description="Junior, Senior, Débutant... indépendantes des rôles." actionLabel="Nouvelle catégorie" actionHref="/admin/categories/create" />
                <FilterBar url="/admin/categories" filters={filters} searchPlaceholder="Rechercher une catégorie..." />
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Concours</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.data.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.name}</TableCell>
                                        <TableCell>{c.description ?? '-'}</TableCell>
                                        <TableCell>{c.contests_count}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={c.active ? 'active' : 'archived'} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/admin/categories/${c.id}/edit`}>Modifier</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {categories.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                            Aucune catégorie.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <DataTablePagination data={categories} />
            </div>
        </AppLayout>
    );
}
