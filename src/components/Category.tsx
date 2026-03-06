import { Button } from '@/components/ui/button';

type CategoryProps = {
  category: string;
};

export const Category: React.FC<CategoryProps> = ({ category }) => {
  return (
    <Button asChild={true} variant="outline" className="font-normal text-foreground no-underline py-1 px-3 h-auto">
      <a href={`/categories/${category}`}>{category}</a>
    </Button>
  );
};
