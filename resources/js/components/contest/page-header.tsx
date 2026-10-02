import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
    children?: ReactNode;
}

export function PageHeader({ title, description, actionLabel, actionHref, children }: PageHeaderProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <div className="flex items-center gap-2">
                {children}
                {actionLabel && actionHref && (
                    <Button asChild>
                        <Link href={actionHref}>{actionLabel}</Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
