import { cn } from '@/lib/utils';

type LoadingProps = {
  className?: string;
  label?: string;
};

export function Loading(props: LoadingProps) {
  const { className, label = 'Loading' } = props;

  return (
    <div className={cn('flex justify-center py-10', className)} role="status" aria-label={label}>
      <span className="size-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
    </div>
  );
}
