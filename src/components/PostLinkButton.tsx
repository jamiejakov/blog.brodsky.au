import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

type PostTitleLinkButtonProps = {
  id: string;
  title: string;
};

export const PostTitleLinkButton: React.FC<PostTitleLinkButtonProps> = (props) => {
  const { id, title } = props;

  return (
    <Button asChild={true} variant="ghostPrimary" className="rounded-full text-2xl font-bold h-auto py-1 no-underline">
      <a href={`/posts/${id}/`}>{title}</a>
    </Button>
  );
};

type PostReadMoreButtonProps = {
  id: string;
};

export const PostReadMoreButton: React.FC<PostReadMoreButtonProps> = (props) => {
  const { id } = props;

  return (
    <Button
      asChild={true}
      variant="outline"
      className="rounded-full text-lg font-medium h-auto py-1 self-end no-underline"
    >
      <a href={`/posts/${id}/`}>
        Read More <ArrowRightIcon className="size-6" />
      </a>
    </Button>
  );
};
