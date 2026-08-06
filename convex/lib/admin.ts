import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

import type { MutationCtx, QueryCtx } from '../_generated/server';

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx);

  if (!userId) {
    throw new ConvexError('Not authenticated');
  }

  const user = await ctx.db.get(userId);
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

  if (!adminEmail || user?.email?.toLowerCase() !== adminEmail) {
    throw new ConvexError('Not authorized');
  }

  return userId;
}
