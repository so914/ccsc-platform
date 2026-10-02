import { router } from '@inertiajs/react';

export function useFilters(url: string, current: Record<string, string | number | undefined | null>) {
    return (changes: Record<string, string | number | undefined | null>) => {
        const merged = { ...current, ...changes };
        const params = Object.fromEntries(Object.entries(merged).filter(([, v]) => v !== '' && v !== undefined && v !== null));
        router.get(url, params, { preserveState: true, replace: true });
    };
}
