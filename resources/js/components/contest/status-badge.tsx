import { Badge } from '@/components/ui/badge';
import { label } from '@/lib/format';

const good = ['open', 'active', 'published', 'registered', 'qualified', 'confirmed', 'passed', 'submitted', 'ongoing', 'registration'];
const bad = ['rejected', 'failed', 'absent', 'expired', 'cancelled', 'withdrawn'];

export function StatusBadge({ value }: { value: string }) {
    const variant = good.includes(value) ? 'default' : bad.includes(value) ? 'destructive' : 'secondary';

    return <Badge variant={variant}>{label(value)}</Badge>;
}
