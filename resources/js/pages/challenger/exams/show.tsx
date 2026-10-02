import { PageHeader } from '@/components/contest/page-header';
import { StatCard } from '@/components/contest/stat-card';
import { StatusBadge } from '@/components/contest/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDate, label } from '@/lib/format';
import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type Answer = string | number | number[] | null;

interface Challenge {
    id: number;
    title: string;
    description: string | null;
    topic: string | null;
    difficulty: string;
    answer_type: string;
    points: number;
    options: { id: number; content: string }[];
}

interface Session {
    id: number;
    seconds_left: number;
    answers: Record<number, Answer>;
    challenges: Challenge[];
}

interface Props {
    exam: {
        id: number;
        name: string;
        description: string | null;
        duration_minutes: number;
        start_at: string | null;
        end_at: string | null;
        max_attempts: number;
        passing_score: number;
        challenges_count: number;
        max_score: number;
    };
    attempts: { id: number; attempt_number: number; started_at: string; submitted_at: string | null; score: number; status: string }[];
    canStart: boolean;
    session: Session | null;
}

function Timer({ seconds, onEnd }: { seconds: number; onEnd: () => void }) {
    const [left, setLeft] = useState(seconds);
    const ended = useRef(false);

    useEffect(() => {
        const id = setInterval(() => setLeft((value) => Math.max(0, value - 1)), 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (left === 0 && !ended.current) {
            ended.current = true;
            onEnd();
        }
    }, [left, onEnd]);

    const minutes = String(Math.floor(left / 60)).padStart(2, '0');
    const rest = String(left % 60).padStart(2, '0');

    return <span className={`font-mono text-lg font-bold ${left < 60 ? 'text-destructive' : ''}`}>{minutes}:{rest}</span>;
}

function ExamSession({ exam, session }: { exam: Props['exam']; session: Session }) {
    const [answers, setAnswers] = useState<Record<number, Answer>>(session.answers);
    const [submitting, setSubmitting] = useState(false);
    const answersRef = useRef(answers);
    answersRef.current = answers;

    const save = () => router.put(`/challenger/attempts/${session.id}/answers`, { answers: answersRef.current }, { preserveState: true, preserveScroll: true, only: [] });

    useEffect(() => {
        const id = setInterval(save, 30000);
        return () => clearInterval(id);
    }, []);

    const submit = () => {
        if (submitting) return;
        setSubmitting(true);
        router.post(`/challenger/attempts/${session.id}/submit`, { answers: answersRef.current });
    };

    const setAnswer = (id: number, value: Answer) => setAnswers({ ...answers, [id]: value });

    const toggleMultiple = (id: number, optionId: number) => {
        const current = (answers[id] as number[] | undefined) ?? [];
        setAnswer(id, current.includes(optionId) ? current.filter((v) => v !== optionId) : [...current, optionId]);
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <PageHeader title={exam.name} description="Vos réponses sont enregistrées automatiquement toutes les 30 secondes.">
                <Timer seconds={session.seconds_left} onEnd={submit} />
                <Button variant="outline" onClick={save}>
                    Enregistrer
                </Button>
                <Button
                    disabled={submitting}
                    onClick={() => {
                        if (confirm('Soumettre définitivement vos réponses ?')) submit();
                    }}
                >
                    Soumettre
                </Button>
            </PageHeader>

            {session.challenges.map((c, index) => (
                <Card key={c.id}>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-base">
                            <span>
                                {index + 1}. {c.title}
                            </span>
                            <span className="text-sm font-normal text-muted-foreground">
                                {c.topic ? `${c.topic} - ` : ''}
                                {label(c.difficulty)} - {c.points} pts
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        {c.description && <p className="whitespace-pre-wrap">{c.description}</p>}

                        {c.answer_type === 'single_choice' &&
                            c.options.map((o) => (
                                <label key={o.id} className="flex items-center gap-2">
                                    <input type="radio" name={`c-${c.id}`} checked={answers[c.id] === o.id} onChange={() => setAnswer(c.id, o.id)} />
                                    {o.content}
                                </label>
                            ))}

                        {c.answer_type === 'multiple_choice' &&
                            c.options.map((o) => (
                                <label key={o.id} className="flex items-center gap-2">
                                    <input type="checkbox" checked={((answers[c.id] as number[] | undefined) ?? []).includes(o.id)} onChange={() => toggleMultiple(c.id, o.id)} />
                                    {o.content}
                                </label>
                            ))}

                        {(c.answer_type === 'short_text' || c.answer_type === 'flag') && (
                            <Input
                                placeholder={c.answer_type === 'flag' ? 'FLAG{...}' : 'Votre réponse'}
                                value={(answers[c.id] as string | undefined) ?? ''}
                                onChange={(e) => setAnswer(c.id, e.target.value)}
                            />
                        )}
                    </CardContent>
                </Card>
            ))}

            <div className="flex justify-end">
                <Button
                    disabled={submitting}
                    onClick={() => {
                        if (confirm('Soumettre définitivement vos réponses ?')) submit();
                    }}
                >
                    Soumettre mes réponses
                </Button>
            </div>
        </div>
    );
}

export default function ChallengerExamShow({ exam, attempts, canStart, session }: Props) {
    const crumbs = [{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Examens', href: '/challenger/exams' }, { title: exam.name, href: '#' }];

    if (session) {
        return (
            <AppLayout breadcrumbs={crumbs}>
                <Head title={exam.name} />
                <ExamSession exam={exam} session={session} />
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={crumbs}>
            <Head title={exam.name} />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title={exam.name} description={exam.description ?? undefined}>
                    {canStart && (
                        <Button
                            onClick={() => {
                                if (confirm(`Démarrer l'examen ? Le chronomètre de ${exam.duration_minutes} minutes commence immédiatement.`)) {
                                    router.post(`/challenger/exams/${exam.id}/start`);
                                }
                            }}
                        >
                            Démarrer
                        </Button>
                    )}
                </PageHeader>

                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard title="Durée" value={`${exam.duration_minutes} min`} />
                    <StatCard title="Challenges" value={exam.challenges_count} />
                    <StatCard title="Score maximum" value={exam.max_score} />
                    <StatCard title="Seuil de réussite" value={`${exam.passing_score} %`} />
                </div>

                <Card>
                    <CardContent className="pt-6 text-sm">
                        Ouverture : {formatDate(exam.start_at)} - Fermeture : {formatDate(exam.end_at)} - Tentatives : {attempts.length} / {exam.max_attempts}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Historique de mes tentatives</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Début</TableHead>
                                    <TableHead>Soumission</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Statut</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attempts.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell>{a.attempt_number}</TableCell>
                                        <TableCell>{formatDate(a.started_at)}</TableCell>
                                        <TableCell>{formatDate(a.submitted_at)}</TableCell>
                                        <TableCell>{a.score}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={a.status} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {attempts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                                            Aucune tentative.
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
