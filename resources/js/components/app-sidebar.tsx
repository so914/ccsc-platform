import { NavCollapsible } from '@/components/nav-collapsible';
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
import { type NavItem, type NavItemWithChildren } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Activity,
    ClipboardList,
    Database,
    Image,
    LayoutGrid,
    Settings,
    Trophy,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {

    // Navigation principale - La plus fréquemment utilisée
    const mainNavItems: NavItem[] = [
        {
            title: "Tableau de bord",
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    // Données de référence - Menu déroulant pour la gestion des données
    const masterDataItems: NavItemWithChildren[] = [
        {
            title: "Données de référence",
            icon: Database,
            items: [
                {
                    title: "Années académiques",
                    href: '/admin/master/academic-years',
                },
                {
                    title: "Étudiants",
                    href: '/admin/master/students',
                },
                {
                    title: "Enseignants",
                    href: '/admin/master/teachers',
                },
                {
                    title: "Salles de classe",
                    href: '/admin/master/classrooms',
                },
                {
                    title: "Matières",
                    href: '/admin/master/subjects',
                },
                {
                    title: "Niveaux",
                    href: '/admin/master/levels',
                },
                {
                    title: "Filières",
                    href: '/admin/master/majors',
                },
                {
                    title: "Activités extrascolaires",
                    href: '/admin/master/extracurriculars',
                },
            ],
        },
    ];

    // PPDB - Gestion des admissions des étudiants
    const ppdbItems: NavItemWithChildren[] = [
        {
            title: "Admissions (PPDB)",
            icon: ClipboardList,
            items: [
                {
                    title: "Périodes",
                    href: '/admin/ppdb/periods',
                },
                {
                    title: "Parcours",
                    href: '/admin/ppdb/paths',
                },
                {
                    title: "Inscriptions",
                    href: '/admin/ppdb/registrations',
                },
                {
                    title: "Documents",
                    href: '/admin/ppdb/documents',
                },
                {
                    title: "Sélections",
                    href: '/admin/ppdb/selections',
                },
            ],
        },
    ];

    // Gestion des utilisateurs & des accès - Sécurité
    const userManagementItems: NavItemWithChildren[] = [
        {
            title: "Gestion des utilisateurs",
            icon: Users,
            items: [
                {
                    title: "Utilisateurs",
                    href: '/admin/users',
                },
                {
                    title: "Rôles",
                    href: '/admin/roles',
                },
                {
                    title: "Permissions",
                    href: '/admin/permissions',
                },
            ],
        },
    ];

    // Éléments d'administration système
    const systemItems: NavItem[] = [
        {
            title: "Journaux d'activité",
            href: '/admin/activity-logs',
            icon: Activity,
        },
        {
            title: "Médiathèque",
            href: '/admin/media',
            icon: Image,
        },
        {
            title: "Paramètres",
            href: '/admin/settings',
            icon: Settings,
        },
    ];

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
                {/* Navigation principale */}
                <NavMain items={mainNavItems} label="Menu" />

                {/* Gestion des données académiques */}
                <NavCollapsible items={masterDataItems} label="Académique" />

                {/* PPDB - Admission des étudiants */}
                <NavCollapsible items={ppdbItems} label="Admission" />

                {/* Contrôle des accès */}
                <NavCollapsible items={userManagementItems} label="Contrôle des accès" />

                {/* Administration système */}
                <NavMain items={systemItems} label="Système" />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
