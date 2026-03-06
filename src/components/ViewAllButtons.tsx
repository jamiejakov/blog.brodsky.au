import { Button } from '@/components/ui/button';
import { ArrowRightIcon, Shapes, Tag } from 'lucide-react';

export const ViewAllTagsButton: React.FC = () => {
  return (
    <Button asChild={true} variant="outline" className="text-l text-primary h-auto py-1 self-center">
      <a href="/tags/">
        <Tag className="size-4" />
        All tags <ArrowRightIcon className="size-6" />
      </a>
    </Button>
  );
};

export const ViewAllCategoriesButton: React.FC = () => {
  return (
    <Button asChild={true} variant="outline" className="text-l text-primary h-auto py-1 self-center">
      <a href="/categories/">
        <Shapes className="size-4" />
        All categories <ArrowRightIcon className="size-6" />
      </a>
    </Button>
  );
};
