import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export const itemSchema = v.object({
  title: v.string(),
  url: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  notes: v.optional(v.string()),
  price: v.optional(v.string()),
  priority: v.optional(v.string()),
  position: v.number(),
});

export const reservationSchema = v.object({
  itemId: v.id('items'),
  reservedBy: v.string(),
  comment: v.optional(v.string()),
});

export default defineSchema({
  ...authTables,
  items: defineTable(itemSchema).index('by_position', ['position']),
  reservations: defineTable(reservationSchema).index('by_item', ['itemId']),
});
