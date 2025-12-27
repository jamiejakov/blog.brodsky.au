import { Button } from '@/components/ui/button';

type BlogTitleLinkButtonProps = {
  id: string;
  title: string;
};

export const BlogTitleLinkButton: React.FC<BlogTitleLinkButtonProps> = (props) => {
  const { id, title } = props;

  return (
    <Button asChild={true} variant="ghostPrimary" className="rounded-full text-2xl font-bold h-auto py-1">
      <a href={`/posts/${id}/`}>{title}</a>
    </Button>
  );
};
