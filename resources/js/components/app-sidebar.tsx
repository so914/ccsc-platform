import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Activity,
    BookOpen,
    CalendarDays,
    ClipboardList,
    Crown,
    FileText,
    Flag,
    FolderOpen,
    Image,
    KeyRound,
    LayoutGrid,
    Library,
    ListOrdered,
    Medal,
    Settings,
    Shield,
    Tag,
    Trophy,
    User,
    UserCheck,
    UserCog,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

type Item = NavItem & { permission?: string };

interface Group {
    label: string;
    items: Item[];
}

const home: Item = { title: 'Tableau de bord', href: dashboard(), icon: LayoutGrid };

const adminGroups: Group[] = [
    { label: 'Menu', items: [home] },
    {
        label: 'Concours',
        items: [
            { title: 'Concours', href: '/admin/contests', icon: Trophy, permission: 'contests.view' },
            { title: 'Catégories', href: '/admin/categories', icon: Tag, permission: 'categories.view' },
            { title: 'Examens', href: '/admin/exams', icon: FileText, permission: 'exams.view' },
            { title: 'Challenges', href: '/admin/challenges', icon: Flag, permission: 'challenges.view' },
            { title: 'Banques de questions', href: '/admin/question-banks', icon: Library, permission: 'question-banks.view' },
        ],
    },
    {
        label: 'Candidats',
        items: [
            { title: 'Challengers', href: '/admin/challengers', icon: Users, permission: 'challengers.view' },
            { title: 'Participants', href: '/admin/participants', icon: User, permission: 'participants.view' },
            { title: 'Inscriptions', href: '/admin/registrations', icon: ClipboardList, permission: 'registrations.manage' },
        ],
    },
    {
        label: 'Résultats',
        items: [
            { title: 'Résultats', href: '/admin/results', icon: FileText, permission: 'results.view' },
            { title: 'Classements', href: '/admin/rankings', icon: ListOrdered, permission: 'rankings.view' },
            { title: 'Finalistes', href: '/admin/finalists', icon: Medal, permission: 'finalists.view' },
            { title: 'Gagnants', href: '/admin/winners', icon: Crown, permission: 'finalists.view' },
        ],
    },
    {
        label: 'Ateliers',
        items: [
            { title: 'Ateliers', href: '/admin/workshops', icon: CalendarDays, permission: 'workshops.view' },
            { title: 'Inscriptions aux ateliers', href: '/admin/workshop-registrations', icon: ClipboardList, permission: 'workshops.view' },
        ],
    },
    {
        label: 'Administration',
        items: [
            { title: 'Utilisateurs', href: '/admin/users', icon: Users, permission: 'users.view' },
            { title: 'Agents', href: '/admin/agents', icon: UserCog, permission: 'agents.view' },
            { title: 'Rôles', href: '/admin/roles', icon: Shield, permission: 'roles.view' },
            { title: 'Permissions', href: '/admin/permissions', icon: KeyRound, permission: 'permissions.view' },
            { title: "Journaux d'activité", href: '/admin/activity-logs', icon: Activity, permission: 'activity-logs.view' },
            { title: 'Médias', href: '/admin/media', icon: Image, permission: 'settings.view' },
            { title: 'Paramètres', href: '/admin/settings', icon: Settings, permission: 'settings.view' },
        ],
    },
];

const agentGroups: Group[] = [
    { label: 'Menu', items: [home] },
    {
        label: 'Mes concours',
        items: [
            { title: 'Concours', href: '/agent/contests', icon: Trophy, permission: 'contests.view' },
            { title: 'Examens', href: '/agent/exams', icon: FileText, permission: 'exams.view' },
            { title: 'Challenges', href: '/agent/challenges', icon: Flag, permission: 'challenges.view' },
            { title: 'Banque de questions', href: '/agent/question-banks', icon: Library, permission: 'question-banks.view' },
        ],
    },
    {
        label: 'Candidats',
        items: [
            { title: 'Challengers', href: '/agent/challengers', icon: Users, permission: 'challengers.view' },
            { title: 'Résultats', href: '/agent/results', icon: FileText, permission: 'results.view' },
        ],
    },
    {
        label: 'Classements',
        items: [{ title: 'Classements', href: '/agent/rankings', icon: ListOrdered, permission: 'rankings.view' }],
    },
];

const challengerGroups: Group[] = [
    { label: 'Menu', items: [home] },
    {
        label: 'Mon concours',
        items: [{ title: 'Mon concours', href: '/challenger/contests', icon: Trophy }],
    },
    {
        label: 'Examens',
        items: [{ title: 'Examens', href: '/challenger/exams', icon: FileText }],
    },
    {
        label: 'Mes résultats',
        items: [
            { title: 'Mes résultats', href: '/challenger/results', icon: ClipboardList },
            { title: 'Classement', href: '/challenger/ranking', icon: ListOrdered },
        ],
    },
    {
        label: 'Compte',
        items: [{ title: 'Mon profil', href: '/settings/profile', icon: User }],
    },
];

const participantGroups: Group[] = [
    { label: 'Menu', items: [home] },
    {
        label: 'Ateliers',
        items: [
            { title: 'Mes ateliers', href: '/participant/workshops', icon: CalendarDays },
            { title: 'Ressources', href: '/participant/resources', icon: FolderOpen },
            { title: 'Mes participations', href: '/participant/participations', icon: UserCheck },
        ],
    },
    {
        label: 'Compte',
        items: [{ title: 'Mon profil', href: '/settings/profile', icon: User }],
    },
];

function groupsFor(roles: string[]): Group[] {
    if (roles.includes('admin')) return adminGroups;
    if (roles.includes('agent')) return agentGroups;
    if (roles.includes('challenger')) return challengerGroups;
    if (roles.includes('participant')) return participantGroups;
    return [{ label: 'Menu', items: [home, { title: 'Aide', href: '/', icon: BookOpen }] }];
}

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.roles.includes('admin');

    const groups = groupsFor(auth.roles)
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => !item.permission || isAdmin || auth.permissions.includes(item.permission)),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {groups.map((group) => (
                    <NavMain key={group.label} items={group.items} label={group.label} />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
