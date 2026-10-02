import { FormField } from '@/components/form-field';
import { PageHeader } from '@/components/contest/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    bank: { id: number; name: string; description: string | null } | null;
    prefix: string;
}

export default function QuestionBankForm({ bank, prefix }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({ name: bank?.name ?? '', description: bank?.description ?? '' });
    const base = `/${prefix}/question-banks`;
    const title = bank ? 'Modifier la banque' : 'Nouvelle banque';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (bank) put(`${base}/${bank.id}`);
        else post(base);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Banques de questions', href: base }, { title, href: '#' }]}>
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
