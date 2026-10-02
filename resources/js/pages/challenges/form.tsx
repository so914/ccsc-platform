import { FormField } from '@/components/form-field';
import { NativeSelect } from '@/components/contest/native-select';
import { PageHeader } from '@/components/contest/page-header';
import { type Ref } from '@/components/contest/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { label } from '@/lib/format';
import { Head, Link, useForm } from '@inertiajs/react';

interface Option {
    content: string;
    is_correct: boolean;
}

interface ChallengeData {
    id: number;
    question_bank_id: number;
    title: string;
    description: string | null;
    topic: string | null;
    difficulty: string;
    points: number;
    answer_type: string;
    expected_answer: string | null;
    explanation: string | null;
    status: string;
    locked: boolean;
    options: Option[];
}

interface Props {
    challenge: ChallengeData | null;
    banks: Ref[];
    answerTypes: string[];
    difficulties: string[];
    statuses: string[];
    prefix: string;
}

export default function ChallengeForm({ challenge, banks, answerTypes, difficulties, statuses, prefix }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        question_bank_id: challenge?.question_bank_id ?? banks[0]?.id ?? '',
        title: challenge?.title ?? '',
        description: challenge?.description ?? '',
        topic: challenge?.topic ?? '',
        difficulty: challenge?.difficulty ?? 'easy',
        points: challenge?.points ?? 100,
        answer_type: challenge?.answer_type ?? 'single_choice',
        expected_answer: challenge?.expected_answer ?? '',
        explanation: challenge?.explanation ?? '',
        status: challenge?.status ?? 'active',
        options: (challenge?.options ?? [
            { content: '', is_correct: true },
            { content: '', is_correct: false },
        ]) as Option[],
    });

    const base = `/${prefix}/challenges`;
    const locked = challenge?.locked ?? false;
    const hasChoices = data.answer_type === 'single_choice' || data.answer_type === 'multiple_choice';
    const formErrors = errors as Record<string, string>;

    const setOption = (index: number, change: Partial<Option>) => {
        setData(
            'options',
            data.options.map((o, i) => {
                if (i === index) return { ...o, ...change };
                if (change.is_correct && data.answer_type === 'single_choice') return { ...o, is_correct: false };
                return o;
            }),
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (challenge) put(`${base}/${challenge.id}`);
        else post(base);
    };

    const title = challenge ? 'Modifier le challenge' : 'Nouveau challenge';

    return (
        <AppLayout breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }, { title: 'Challenges', href: base }, { title, href: '#' }]}>
            <Head title={title} />
            <div className="flex flex-col gap-4 p-4">
                <PageHeader title={title} />
                {locked && (
                    <p className="rounded-md border p-3 text-sm">
                        Ce challenge est utilisé dans un examen qui a des tentatives : seuls le statut et l'explication peuvent être modifiés.
                    </p>
                )}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Banque de questions" error={errors.question_bank_id} required>
                                    <NativeSelect disabled={locked} value={data.question_bank_id} onChange={(e) => setData('question_bank_id', Number(e.target.value))}>
                                        {banks.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </FormField>
                                <FormField label="Titre" error={errors.title} required>
                                    <Input disabled={locked} value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                </FormField>
                            </div>

                            <FormField label="Énoncé" error={errors.description}>
                                <Textarea disabled={locked} value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </FormField>

                            <div className="grid gap-4 md:grid-cols-4">
                                <FormField label="Domaine" help="WEB, LINUX, CRYPTO..." error={errors.topic}>
                                    <Input disabled={locked} value={data.topic} onChange={(e) => setData('topic', e.target.value)} />
                                </FormField>
                                <FormField label="Difficulté" error={errors.difficulty}>
                                    <NativeSelect disabled={locked} value={data.difficulty} onChange={(e) => setData('difficulty', e.target.value)}>
                                        {difficulties.map((d) => (
                                            <option key={d} value={d}>
                                                {label(d)}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </FormField>
                                <FormField label="Points" error={errors.points}>
                                    <Input disabled={locked} type="number" value={data.points} onChange={(e) => setData('points', Number(e.target.value))} />
                                </FormField>
                                <FormField label="Type de réponse" error={errors.answer_type}>
                                    <NativeSelect disabled={locked} value={data.answer_type} onChange={(e) => setData('answer_type', e.target.value)}>
                                        {answerTypes.map((t) => (
                                            <option key={t} value={t}>
                                                {label(t)}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </FormField>
                            </div>

                            {hasChoices ? (
                                <FormField label="Options" error={formErrors.options}>
                                    <div className="space-y-2">
                                        {data.options.map((o, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <input
                                                    type={data.answer_type === 'single_choice' ? 'radio' : 'checkbox'}
                                                    disabled={locked}
                                                    checked={o.is_correct}
                                                    onChange={(e) => setOption(index, { is_correct: data.answer_type === 'single_choice' ? true : e.target.checked })}
                                                />
                                                <Input disabled={locked} value={o.content} onChange={(e) => setOption(index, { content: e.target.value })} placeholder={`Option ${index + 1}`} />
                                                {!locked && data.options.length > 2 && (
                                                    <Button type="button" variant="outline" size="sm" onClick={() => setData('options', data.options.filter((_, i) => i !== index))}>
                                                        Retirer
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        {!locked && (
                                            <Button type="button" variant="outline" size="sm" onClick={() => setData('options', [...data.options, { content: '', is_correct: false }])}>
                                                Ajouter une option
                                            </Button>
                                        )}
                                    </div>
                                </FormField>
                            ) : (
                                <FormField
                                    label={data.answer_type === 'flag' ? 'Flag attendu' : 'Réponse attendue'}
                                    help={data.answer_type === 'short_text' ? 'Séparez plusieurs réponses acceptées par |. La casse est ignorée.' : 'Comparaison exacte.'}
                                    error={errors.expected_answer}
                                >
                                    <Input disabled={locked} value={data.expected_answer} onChange={(e) => setData('expected_answer', e.target.value)} />
                                </FormField>
                            )}

                            <FormField label="Explication / correction" error={errors.explanation}>
                                <Textarea value={data.explanation} onChange={(e) => setData('explanation', e.target.value)} />
                            </FormField>

                            <FormField label="Statut" error={errors.status}>
                                <NativeSelect value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                    {statuses.map((s) => (
                                        <option key={s} value={s}>
                                            {label(s)}
                                        </option>
                                    ))}
                                </NativeSelect>
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
