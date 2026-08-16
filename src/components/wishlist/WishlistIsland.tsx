import { Spinner } from '@/components/ui/spinner';
import { useMutation, useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { ConvexClient } from '../ConvexClient';
import { ItemCard, type WishlistItem } from './ItemCard';
import { NothingOnList } from './NothingOnList';
import { ReserveDialog } from './ReserveDialog';

export const WishlistIsland: React.FC = () => (
  <ConvexClient>
    <Wishlist />
  </ConvexClient>
);

const Wishlist: React.FC = () => {
  const items = useQuery(api.items.listPublic);
  const reserveItem = useMutation(api.reservations.reserve);

  if (items == null) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="size-8" aria-label="Loading wishlist" />
      </div>
    );
  }

  if (items.length === 0) {
    return <NothingOnList />;
  }

  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => (
        <WishlistItemRow key={item._id} item={item} onReserve={reserveItem} />
      ))}
    </div>
  );
};

type WishlistItemRowProps = {
  item: WishlistItem;
  onReserve: (args: { itemId: Id<'items'>; reservedBy: string; comment?: string }) => Promise<unknown>;
};

function WishlistItemRow(props: WishlistItemRowProps) {
  const { item, onReserve } = props;

  return (
    <ItemCard
      item={item}
      showReservedRibbon={true}
      sideButtons={item.reservation == null ? <ReserveDialog item={item} onReserve={onReserve} /> : undefined}
    />
  );
}
