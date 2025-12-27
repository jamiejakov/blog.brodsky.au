import { Button } from '@/components/ui/button';
import { Milestone } from 'lucide-react';

export const FullBlogLinkButton: React.FC = () => {
  return (
    <Button asChild={true} variant="outline" className="text-xl font-bold h-auto py-1 self-center">
      <a href="/blog/">
        See All Posts <Milestone className="size-6" />
      </a>
    </Button>
  );
};
