import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, Plus, Settings, Shield, ShieldCheck, TrendingUp, Users } from 'lucide-react';

interface Stats {
    total_users: number;
    total_roles: number;
    total_permissions: number;
    recent_users: number;
}

interface RecentActivity {
    id: number;
    description: string;
    subject_type: string | null;
    subject_id: number | null;
    causer_name: string;
    created_at: string;
}

interface Props {
    stats: Stats;
    recentActivities: RecentActivity[];
}

export default function Dashboard({ stats, recentActivities }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Tableau de bord',
            href: dashboard().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tableau de bord" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Grille des statistiques */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total des utilisateurs</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">+{stats.recent_users}</span> cette semaine
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total des rôles</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_roles}</div>
                            <p className="text-xs text-muted-foreground">Rôles actifs</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total des permissions</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_permissions}</div>
                            <p className="text-xs text-muted-foreground">Règles d'accès</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Croissance</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_users > 0
                                    ? `${Math.round((stats.recent_users / stats.total_users) * 100)}%`
                                    : '0%'}
                            </div>
                            <p className="text-xs text-muted-foreground">Nouveaux utilisateurs cette semaine</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Contenu principal */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Activité récente */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Activité récente</CardTitle>
                            <CardDescription>Dernières actions effectuées dans le système</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentActivities.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
                            ) : (
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-center gap-4">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                                <Activity className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {activity.description}
                                                    {activity.subject_type && (
                                                        <span className="text-muted-foreground">
                                                            {' '}{activity.subject_type} #{activity.subject_id}
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    par {activity.causer_name} · {activity.created_at}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions rapides */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Actions rapides</CardTitle>
                            <CardDescription>Tâches courantes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                <Link
                                    href="/admin/users/create"
                                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <Plus className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Ajouter un utilisateur</p>
                                        <p className="text-xs text-muted-foreground">Créer un nouveau compte utilisateur</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/admin/roles/create"
                                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <Shield className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Créer un rôle</p>
                                        <p className="text-xs text-muted-foreground">Définir un nouveau rôle et ses permissions</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/admin/settings"
                                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <Settings className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Paramètres de l'application</p>
                                        <p className="text-xs text-muted-foreground">Configurer les paramètres de l'application</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/admin/activity-logs"
                                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <Activity className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Journaux d'activité</p>
                                        <p className="text-xs text-muted-foreground">Consulter l'historique des activités</p>
                                    </div>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}