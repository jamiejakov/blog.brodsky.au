import { ConvexClient } from '@/components/ConvexClient';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { useEffect } from 'react';

import { LoginForm } from './LoginForm';

export const LoginIsland: React.FC = () => (
  <ConvexClient>
    <AuthLoading>
      <LoginForm />
    </AuthLoading>
    <Unauthenticated>
      <LoginForm />
    </Unauthenticated>
    <Authenticated>
      <RedirectToWishlist />
    </Authenticated>
  </ConvexClient>
);

const RedirectToWishlist: React.FC = () => {
  useEffect(() => {
    window.location.replace('/wishlist');
  }, []);

  return null;
};
