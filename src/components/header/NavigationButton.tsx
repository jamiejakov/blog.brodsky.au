import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

type NavigationButtonProps = {
  link: string;
  title: string;
  currentPath: string;
};

export const NavigationButton: React.FC<NavigationButtonProps> = (props) => {
  const { link, title, currentPath } = props;

  const isActive =
    link === '/'
      ? currentPath === '/' || currentPath.startsWith('/blog') || currentPath.startsWith('/posts')
      : currentPath === link || currentPath.startsWith(`${link}/`);

  return (
    <Button
      asChild={true}
      variant="ghost"
      className={cn('navigation-button min-w-0 flex-1 hover:text-primary', isActive && 'bg-black/20')}
    >
      <a href={link}>{title}</a>
    </Button>
  );
};
