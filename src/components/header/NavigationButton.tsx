import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

type NavigationButtonProps = {
  link: string;
  title: string;
  currentPath: string;
};

export const NavigationButton: React.FC<NavigationButtonProps> = (props) => {
  const { link, title, currentPath } = props;

  return (
    <Button
      asChild={true}
      variant="ghost"
      className={cn('navigation-button rounded-full', currentPath === link && 'bg-black/20')}
    >
      <a href={link}>{title}</a>
    </Button>
  );
};
