import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { ConvexReactClient } from 'convex/react';

function getConvexUrl(): string {
  const url: unknown = import.meta.env.PUBLIC_CONVEX_URL;
  return typeof url === 'string' ? url : '';
}

const convexUrl = getConvexUrl();
const client = convexUrl ? new ConvexReactClient(convexUrl) : null;

type ConvexClientProps = React.PropsWithChildren;

export const ConvexClient: React.FC<ConvexClientProps> = (props) => {
  const { children } = props;

  if (!client) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card px-6 py-8 text-center text-muted-foreground">
        Wishlist is not configured yet. Set <code>PUBLIC_CONVEX_URL</code> and deploy the Convex backend.
      </p>
    );
  }

  return <ConvexAuthProvider client={client}>{children}</ConvexAuthProvider>;
};
