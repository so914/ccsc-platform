import { type SelectHTMLAttributes } from 'react';

export function NativeSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
    return <select {...props} className={`h-9 rounded-md border border-input bg-background px-3 text-sm ${props.className ?? ''}`} />;
}
