import { Button } from '@/components/ui/button';
import { Milestone } from 'lucide-react';
import { useCallback } from 'react';

export const FullBlogLinkButton: React.FC = () => {
  const handleClick = useCallback(() => {
    window.posthog?.capture('see_more_posts_clicked');
  }, []);

  return (
    <Button asChild={true} variant="outline" className="text-xl font-bold h-auto py-1 self-center">
      <a href="/blog/" onClick={handleClick}>
        See more posts <Milestone className="size-6" />
      </a>
    </Button>
  );
};
