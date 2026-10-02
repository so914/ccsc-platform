import { PageHeader } from '@/components/contest/page-header';
import { StatusBadge } from '@/components/contest/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { label } from '@/lib/format';
import { Head, Link } from '@inertiajs/react';

interface Props {
    bank: {
        id: number;
        name: string;
        description: string | null;
        challenges: { id: number; title: string; topic: string | null; difficulty: string; points: number; status: string }[];
    };
    prefix: string;
}

export default function QuestionBankShow({ bank, prefix }: Props) {
    const base = `/${prefix}/question-banks`;

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Banques de questions', href: base }, { title: bank.name, href: '#' }]}>
            <Head title={bank.name} />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title={bank.name} description={bank.description ?? undefined} actionLabel="Nouveau challenge" actionHref={`/${prefix}/challenges/create`} />
                <Card>
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Titre</TableHead>
                                    <TableHead>Domaine</TableHead>
                                    <TableHead>Difficulté</TableHead>
                                    <TableHead>Points</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bank.challenges.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.title}</TableCell>
                                        <TableCell>{c.topic ?? '-'}</TableCell>
                                        <TableCell>{label(c.difficulty)}</TableCell>
                                        <TableCell>{c.points}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={c.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/${prefix}/challenges/${c.id}/edit`}>Modifier</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {bank.challenges.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                            Aucun challenge dans cette banque.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
