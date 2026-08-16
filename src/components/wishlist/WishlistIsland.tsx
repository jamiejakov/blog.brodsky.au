import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';

import { ConvexClient } from '../ConvexClient';
import { AdminView } from './admin/AdminView';
import { PublicView } from './public/PublicView';

export const WishlistIsland: React.FC = () => (
  <ConvexClient>
    <AuthLoading>
      <PublicView />
    </AuthLoading>
    <Unauthenticated>
      <PublicView />
    </Unauthenticated>
    <Authenticated>
      <AdminView />
    </Authenticated>
  </ConvexClient>
);
