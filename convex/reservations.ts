import { ConvexError, v } from 'convex/values';

import { mutation } from './_generated/server';
import { requireAdmin } from './lib/admin';
import { reservationSchema } from './schema';

export const reserve = mutation({
  args: reservationSchema.fields,
  handler: async (ctx, args) => {
    const name = args.reservedBy.trim();

    if (!name) {
      throw new ConvexError('Name is required');
    }

    const item = await ctx.db.get(args.itemId);

    if (!item) {
      throw new ConvexError('Item not found');
    }

    const existing = await ctx.db
      .query('reservations')
      .withIndex('by_item', (q) => q.eq('itemId', args.itemId))
      .unique();

    if (existing) {
      throw new ConvexError('This item has already been reserved');
    }

    return ctx.db.insert('reservations', {
      itemId: args.itemId,
      reservedBy: name,
      comment: args.comment?.trim() ?? undefined,
    });
  },
});

export const unreserve = mutation({
  args: {
    itemId: v.id('items'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const reservation = await ctx.db
      .query('reservations')
      .withIndex('by_item', (q) => q.eq('itemId', args.itemId))
      .unique();

    if (reservation) {
      await ctx.db.delete(reservation._id);
    }
  },
});
