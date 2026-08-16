import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery } from 'convex/react';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { ItemCard, type WishlistItem } from '../common/ItemCard';
import { ListLoading } from '../common/ListLoading';
import { NothingOnList } from '../common/NothingOnList';
import {
  countItemsForPerson,
  DEFAULT_WISHLIST_PERSON,
  WISHLIST_PEOPLE,
  WISHLIST_PERSON_LABELS,
  type WishlistPerson,
} from '../common/people';
import { WishlistPersonIntro } from './PersonIntros';
import { ReserveDialog } from './ReserveDialog';

export const PublicView: React.FC = () => {
  const items = useQuery(api.items.listPublic);
  const reserveItem = useMutation(api.reservations.reserve);

  return (
    <div className="flex flex-col gap-6">
      <div className="px-4 lg:px-0">
        <h1 className="text-3xl font-bold">Brodsky Family Wishlist</h1>
      </div>

      <Tabs defaultValue={DEFAULT_WISHLIST_PERSON} className="gap-4">
        <TabsList className="mx-4 w-[calc(100%-2rem)] lg:mx-0 lg:w-full">
          {WISHLIST_PEOPLE.map((person) => (
            <TabsTrigger key={person} value={person}>
              {WISHLIST_PERSON_LABELS[person]} ({countItemsForPerson(items ?? [], person)})
            </TabsTrigger>
          ))}
        </TabsList>
        {WISHLIST_PEOPLE.map((person) => (
          <TabsContent key={person} value={person} className="flex flex-col gap-6">
            <WishlistPersonIntro person={person} />
            <PersonList person={person} items={items} onReserve={reserveItem} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

type PersonTabProps = {
  person: WishlistPerson;
  items: WishlistItem[] | undefined;
  onReserve: (args: { itemId: Id<'items'>; reservedBy: string; comment?: string }) => Promise<unknown>;
};

const PersonList: React.FC<PersonTabProps> = (props) => {
  const { person, items, onReserve } = props;

  if (items == null) {
    return <ListLoading />;
  }

  const personItems = items.filter((item) => item.requestedBy === person);

  if (personItems.length === 0) {
    return <NothingOnList />;
  }

  return personItems.map((item) => <WishlistItemRow key={item._id} item={item} onReserve={onReserve} />);
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
      sideButtons={item.reservation == null ? <ReserveDialog item={item} onReserve={onReserve} /> : undefined}
    />
  );
}
