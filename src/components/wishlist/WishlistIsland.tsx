import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery } from 'convex/react';

import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { ConvexClient } from '../ConvexClient';
import { ItemCard, type WishlistItem } from './ItemCard';
import { NothingOnList } from './NothingOnList';
import {
  countItemsForPerson,
  DEFAULT_WISHLIST_PERSON,
  WISHLIST_PEOPLE,
  WISHLIST_PERSON_LABELS,
  type WishlistPerson,
} from './people';
import { WishlistPersonIntro } from './PersonIntros';
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

  return (
    <Tabs defaultValue={DEFAULT_WISHLIST_PERSON} className="gap-4">
      <TabsList className="mx-4 w-[calc(100%-2rem)] lg:mx-0 lg:w-full">
        {WISHLIST_PEOPLE.map((person) => (
          <TabsTrigger key={person} value={person}>
            {WISHLIST_PERSON_LABELS[person]} ({countItemsForPerson(items, person)})
          </TabsTrigger>
        ))}
      </TabsList>
      {WISHLIST_PEOPLE.map((person) => (
        <PersonTab key={person} person={person} items={items} onReserve={reserveItem} />
      ))}
    </Tabs>
  );
};

type PersonTabProps = {
  person: WishlistPerson;
  items: WishlistItem[];
  onReserve: (args: { itemId: Id<'items'>; reservedBy: string; comment?: string }) => Promise<unknown>;
};

const PersonTab: React.FC<PersonTabProps> = (props) => {
  const { person, items, onReserve } = props;
  const personItems = items.filter((item) => item.requestedBy === person);

  return (
    <TabsContent value={person} className="flex flex-col gap-6">
      <WishlistPersonIntro person={person} />
      {personItems.length === 0 ? (
        <NothingOnList />
      ) : (
        personItems.map((item) => <WishlistItemRow key={item._id} item={item} onReserve={onReserve} />)
      )}
    </TabsContent>
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
