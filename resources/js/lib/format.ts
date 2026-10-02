export function formatDate(value?: string | null): string {
    if (!value) return '-';
    return new Date(value).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
}

export function toInputDate(value?: string | null): string {
    if (!value) return '';
    const date = new Date(value);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return `${minutes} min ${String(rest).padStart(2, '0')} s`;
}

const labels: Record<string, string> = {
    draft: 'Brouillon',
    registration: 'Inscriptions',
    ongoing: 'En cours',
    finished: 'Terminé',
    archived: 'Archivé',
    scheduled: 'Programmé',
    open: 'Ouvert',
    closed: 'Fermé',
    published: 'Publié',
    active: 'Actif',
    registered: 'Inscrit',
    withdrawn: 'Retiré',
    rejected: 'Refusé',
    cancelled: 'Annulé',
    qualified: 'Qualifié',
    confirmed: 'Confirmé',
    absent: 'Absent',
    passed: 'Réussi',
    failed: 'Échoué',
    submitted: 'Soumis',
    expired: 'Expiré',
    in_progress: 'En cours',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    single_choice: 'Choix unique',
    multiple_choice: 'Choix multiple',
    short_text: 'Texte court',
    flag: 'Flag',
    score_desc: 'Score décroissant',
    time_asc: 'Temps croissant',
    submitted_at_asc: 'Date de soumission',
};

export function label(value: string): string {
    return labels[value] ?? value;
}
