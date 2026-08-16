export const WISHLIST_PEOPLE = ['vadim', 'kotone', 'haru'] as const;
export type WishlistPerson = (typeof WISHLIST_PEOPLE)[number];

export const DEFAULT_WISHLIST_PERSON: WishlistPerson = 'vadim';

export const WISHLIST_PERSON_LABELS: Record<WishlistPerson, string> = {
  vadim: 'Vadim',
  kotone: 'Kotone',
  haru: 'Haru',
};

export const WISHLIST_PERSON_OPTIONS = WISHLIST_PEOPLE.map((value) => ({
  value,
  label: WISHLIST_PERSON_LABELS[value],
}));

export function countItemsForPerson(items: readonly { requestedBy: WishlistPerson }[], person: WishlistPerson) {
  return items.filter((item) => item.requestedBy === person).length;
}
