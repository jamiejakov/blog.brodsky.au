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
  /** When true, shows "Read More" (excerpt was truncated). When false, shows "View Post". */
  hasExcerpt?: boolean;
};

export const PostReadMoreButton: React.FC<PostReadMoreButtonProps> = (props) => {
  const { id, hasExcerpt = true } = props;
  const label = hasExcerpt ? 'Read More' : 'View Post';

  return (
    <Button
      asChild={true}
      variant="outline"
      className="rounded-full text-lg font-medium h-auto py-1 self-end no-underline"
    >
      <a href={`/posts/${id}/`}>
        {label} <ArrowRightIcon className="size-6" />
      </a>
    </Button>
  );
};
