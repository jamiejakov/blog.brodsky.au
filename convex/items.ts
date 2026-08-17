import { v } from 'convex/values';

import type { Doc } from './_generated/dataModel';
import type { QueryCtx } from './_generated/server';
import { mutation, query } from './_generated/server';
import { requireAdmin } from './lib/admin';
import { itemSchema } from './schema';

export const listPublic = query({
  args: {},
  handler: (ctx) => getItemsWithReservations(ctx, false),
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return getItemsWithReservations(ctx, true);
  },
});

export const create = mutation({
  args: itemSchema.fields,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return ctx.db.insert('items', args);
  },
});

export const update = mutation({
  args: {
    id: v.id('items'),
    ...itemSchema.omit('position').fields,
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const reorder = mutation({
  args: {
    orderedIds: v.array(v.id('items')),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    if (args.orderedIds.length === 0) {
      return;
    }

    const orderedItems = await Promise.all(args.orderedIds.map((id) => ctx.db.get(id)));
    if (orderedItems.some((item) => item == null)) {
      throw new Error('One or more items were not found');
    }

    const person = orderedItems[0]!.requestedBy;
    if (orderedItems.some((item) => item!.requestedBy !== person)) {
      throw new Error('All reordered items must belong to the same person');
    }

    const allItems = await ctx.db.query('items').withIndex('by_position').collect();
    const personItems = allItems.filter((item) => item.requestedBy === person);

    if (personItems.length !== args.orderedIds.length) {
      throw new Error('Ordered list must include every item for this person');
    }

    const personIdSet = new Set(personItems.map((item) => item._id));
    if (args.orderedIds.some((id) => !personIdSet.has(id))) {
      throw new Error('Ordered list contains items that do not belong to this person');
    }

    await Promise.all(args.orderedIds.map((id, index) => ctx.db.patch(id, { position: index })));
  },
});

export const remove = mutation({
  args: {
    id: v.id('items'),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const reservation = await ctx.db
      .query('reservations')
      .withIndex('by_item', (q) => q.eq('itemId', args.id))
      .unique();

    if (reservation) {
      await ctx.db.delete(reservation._id);
    }

    await ctx.db.delete(args.id);
  },
});

async function getItemsWithReservations(ctx: QueryCtx, includeComments: boolean) {
  const items = await ctx.db.query('items').withIndex('by_position').collect();

  return Promise.all(
    items.map(async (item) => {
      const reservation = await ctx.db
        .query('reservations')
        .withIndex('by_item', (q) => q.eq('itemId', item._id))
        .unique();

      return {
        _id: item._id,
        title: item.title,
        url: item.url,
        imageUrl: item.imageUrl,
        notes: item.notes,
        price: item.price,
        priority: item.priority,
        position: item.position,
        requestedBy: item.requestedBy,
        reservation: reservation ? buildReservation(reservation, includeComments) : null,
      };
    })
  );
}

function buildReservation(reservation: Doc<'reservations'>, includeComments: boolean) {
  return {
    reservedBy: reservation.reservedBy,
    _creationTime: reservation._creationTime,
    ...(includeComments ? { comment: reservation.comment } : {}),
  };
}
