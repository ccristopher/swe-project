import type * as React from 'react';
import { cn } from '@/lib/utils';

type ProgressProps = React.ComponentProps<'div'> & {
  indicatorClassName?: string;
  value?: number;
};

function Progress({
  className,
  indicatorClassName,
  value = 0,
  ...props
}: ProgressProps) {
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(normalizedValue)}
      className={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)}
      data-slot="progress"
      role="progressbar"
      {...props}
    >
      <div
        className={cn('bg-primary h-full w-full flex-1 transition-transform', indicatorClassName)}
        data-slot="progress-indicator"
        style={{ transform: `translateX(-${100 - normalizedValue}%)` }}
      />
    </div>
  );
}

export { Progress };
