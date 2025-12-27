import { Button } from '../ui/button';

type NavigationButtonProps = {
  link: string;
  title: string;
};

export const NavigationButton: React.FC<NavigationButtonProps> = (props) => {
  const { link, title } = props;

  return (
    <Button asChild={true} variant="ghost">
      <a href={link}>{title}</a>
    </Button>
  );
};
