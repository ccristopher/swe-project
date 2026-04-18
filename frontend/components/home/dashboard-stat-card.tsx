import { Card } from '@/components/ui/card';
import type { DashboardStat } from './home-content.data';

const statToneClassNames = {
  book: 'bg-secondary-container text-on-secondary-container',
  pages: 'bg-primary-container text-on-primary-fixed-variant',
  rank: 'bg-tertiary-container text-on-tertiary-container',
} as const;

export function DashboardStatCard({ icon: Icon, label, tone, value }: DashboardStat) {
  return (
    <Card className="min-h-38 gap-0 rounded-[1.9rem] border-0 bg-surface-container-low p-5 text-center shadow-[0_14px_30px_var(--card-shadow)]">
      <div
        className={`mx-auto flex size-11 items-center justify-center rounded-[1.1rem] ${statToneClassNames[tone]}`}
      >
        <Icon className="size-5" />
      </div>

      <p className="mt-4 text-sm font-medium text-on-surface-variant">{label}</p>
      <p className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground">
        {value}
      </p>
    </Card>
  );
}
