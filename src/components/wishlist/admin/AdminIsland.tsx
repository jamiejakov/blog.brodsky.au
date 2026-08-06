import { ConvexClient } from '@/components/ConvexClient';
import { Spinner } from '@/components/ui/spinner';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';

import { AdminDashboard } from './AdminDashboard';
import { SignInForm } from './SignIn';

export const AdminIsland: React.FC = () => (
  <ConvexClient>
    <AuthLoading>
      <div className="flex justify-center py-10">
        <Spinner className="size-8" aria-label="Checking authentication" />
      </div>
    </AuthLoading>
    <Unauthenticated>
      <SignInForm />
    </Unauthenticated>
    <Authenticated>
      <AdminDashboard />
    </Authenticated>
  </ConvexClient>
);
