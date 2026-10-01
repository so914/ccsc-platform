import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface AcademicYear {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    semesters_count: number;
}

interface Props {
    academicYears: {
        data: AcademicYear[];
        links: any;
        meta: any;
    };
    filters: {
        search?: string;
    };
}

export default function AcademicYearsIndex({ academicYears, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tableau de bord', href: '/dashboard' },
        { title: 'Données de référence', href: '#' },
        { title: 'Années académiques', href: '/admin/master/academic-years' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/master/academic-years', { search }, { preserveState: true });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/master/academic-years/${deleteId}`);
            setDeleteId(null);
        }
    };

    const handleActivate = (id: number) => {
        router.post(`/admin/master/academic-years/${id}/activate`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Années académiques" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Années académiques</h1>
                    <Link href="/admin/master/academic-years/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Ajouter une année académique
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Toutes les années académiques</CardTitle>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input
                                    placeholder="Rechercher une année académique..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-64"
                                />
                                <Button type="submit" variant="secondary">
                                    Rechercher
                                </Button>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nom</TableHead>
                                    <TableHead>Date de début</TableHead>
                                    <TableHead>Date de fin</TableHead>
                                    <TableHead>Semestres</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {academicYears?.data?.map((year) => (
                                    <TableRow key={year.id}>
                                        <TableCell className="font-medium">{year.name}</TableCell>
                                        <TableCell>{new Date(year.start_date).toLocaleDateString('fr-FR')}</TableCell>
                                        <TableCell>{new Date(year.end_date).toLocaleDateString('fr-FR')}</TableCell>
                                        <TableCell>{year.semesters_count}</TableCell>
                                        <TableCell>
                                            {year.is_active ? (
                                                <Badge variant="default">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {!year.is_active && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleActivate(year.id)}
                                                        title="Activer"
                                                    >
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Link href={`/admin/master/academic-years/${year.id}/edit`}>
                                                    <Button variant="ghost" size="icon" title="Modifier">
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Supprimer"
                                                    onClick={() => setDeleteId(year.id)}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!academicYears?.data || academicYears.data.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Aucune année académique trouvée.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer l'année académique</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Voulez-vous vraiment supprimer cette année académique ?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}