import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import type { Doc } from './_generated/dataModel';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  callbacks: {
    async beforeSessionCreation(ctx, { userId }) {
      const user = (await ctx.db.get(userId)) as Doc<'users'> | null;
      const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
      const userEmail = user?.email?.toLowerCase();

      if (!adminEmail) {
        throw new ConvexError('ADMIN_EMAIL is not configured on the server');
      }

      if (userEmail !== adminEmail) {
        throw new ConvexError('Only the site owner can sign in');
      }
    },
  },
});
