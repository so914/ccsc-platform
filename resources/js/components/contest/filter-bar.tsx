import { Input } from '@/components/ui/input';
import { useFilters } from '@/hooks/use-filters';
import { NativeSelect } from './native-select';
import { useState } from 'react';

interface Option {
    value: string | number;
    label: string;
}

interface SelectFilter {
    name: string;
    placeholder: string;
    options: Option[];
}

interface FilterBarProps {
    url: string;
    filters: Record<string, string | number | undefined | null>;
    searchPlaceholder?: string;
    selects?: SelectFilter[];
}

export function FilterBar({ url, filters, searchPlaceholder, selects = [] }: FilterBarProps) {
    const apply = useFilters(url, filters);
    const [search, setSearch] = useState(String(filters.search ?? ''));

    return (
        <div className="flex flex-wrap items-center gap-2">
            {searchPlaceholder && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        apply({ search });
                    }}
                >
                    <Input className="w-64" placeholder={searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
                </form>
            )}
            {selects.map((select) => (
                <NativeSelect key={select.name} value={String(filters[select.name] ?? '')} onChange={(e) => apply({ [select.name]: e.target.value })}>
                    <option value="">{select.placeholder}</option>
                    {select.options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </NativeSelect>
            ))}
        </div>
    );
}
