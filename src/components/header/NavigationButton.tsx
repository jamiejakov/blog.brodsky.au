import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

type NavigationButtonProps = {
  link: string;
  title: string;
  currentPath: string;
};

export const NavigationButton: React.FC<NavigationButtonProps> = (props) => {
  const { link, title, currentPath } = props;

  const currentPathIsBlog = currentPath.includes('/blog') && link === '/';
  const isActive = currentPath.includes(link) || currentPathIsBlog;

  return (
    <Button asChild={true} variant="ghost" className={cn('navigation-button', isActive && 'bg-black/20')}>
      <a href={link}>{title}</a>
    </Button>
  );
};
