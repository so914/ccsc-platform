import { FormField } from '@/components/form-field';
import { PageHeader } from '@/components/contest/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    category: { id: number; name: string; description: string | null; active: boolean } | null;
}

export default function CategoryForm({ category }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name ?? '',
        description: category?.description ?? '',
        active: category?.active ?? true,
    });
    const title = category ? 'Modifier la catégorie' : 'Nouvelle catégorie';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (category) put(`/admin/categories/${category.id}`);
        else post('/admin/categories');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Catégories', href: '/admin/categories' }, { title, href: '#' }]}>
            <Head title={title} />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title={title} />
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="max-w-xl space-y-4">
                            <FormField label="Nom" error={errors.name} required>
                                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            </FormField>
                            <FormField label="Description" error={errors.description}>
                                <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </FormField>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={data.active} onChange={(e) => setData('active', e.target.checked)} />
                                Catégorie active
                            </label>
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    Enregistrer
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/admin/categories">Annuler</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
