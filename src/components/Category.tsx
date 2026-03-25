import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

type CategoryProps = {
  category: string;
};

export const Category: React.FC<CategoryProps> = ({ category }) => {
  const handleClick = useCallback(() => {
    window.posthog?.capture('category_clicked', { category });
  }, [category]);

  return (
    <Button asChild={true} variant="outline" className="font-normal text-foreground no-underline py-1 px-3 h-auto">
      <a href={`/categories/${category}`} onClick={handleClick}>
        {category}
      </a>
    </Button>
  );
};
