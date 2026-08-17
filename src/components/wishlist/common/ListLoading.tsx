import { Spinner } from '@/components/ui/spinner';

type ListLoadingProps = {
  label?: string;
};

export const ListLoading: React.FC<ListLoadingProps> = (props) => {
  const { label = 'Loading wishlist' } = props;

  return (
    <div
      className="flex justify-center rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center
        text-muted-foreground"
    >
      <Spinner className="size-8" aria-label={label} />
    </div>
  );
};
