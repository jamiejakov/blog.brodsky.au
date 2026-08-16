import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthActions } from '@convex-dev/auth/react';
import { useMutation, useQuery } from 'convex/react';
import { LogOut } from 'lucide-react';
import { useCallback, useState } from 'react';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { WishlistItem } from '../common/ItemCard';
import { ItemCard } from '../common/ItemCard';
import { ListLoading } from '../common/ListLoading';
import { NothingOnList } from '../common/NothingOnList';
import {
  countItemsForPerson,
  DEFAULT_WISHLIST_PERSON,
  WISHLIST_PEOPLE,
  WISHLIST_PERSON_LABELS,
  type WishlistPerson,
} from '../common/people';
import { ItemDeleteDialog } from './ItemDeleteDialog';
import { ItemEditDialog, ItemNewDialog } from './ItemEditDialog';
import type { ItemFormState } from './ItemEditForm';
import { ItemUnreserveDialog } from './ItemUnreserveDialog';

export const AdminView: React.FC = () => {
  const { signOut } = useAuthActions();
  const items = useQuery(api.items.listAdmin);
  const createItem = useMutation(api.items.create);
  const updateItem = useMutation(api.items.update);
  const removeItem = useMutation(api.items.remove);
  const unreserveItem = useMutation(api.reservations.unreserve);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = useCallback(() => {
    setSigningOut(true);
    void signOut().finally(() => {
      setSigningOut(false);
    });
  }, [signOut]);

  const handleCreate = useCallback(
    async (values: ItemFormState) => {
      await createItem(toItemArgs(values));
    },
    [createItem]
  );

  const handleUpdate = useCallback(
    async (itemId: Id<'items'>, values: ItemFormState) => {
      await updateItem({ id: itemId, ...toItemArgs(values) });
    },
    [updateItem]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="px-4 lg:px-0 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="px-4 lg:px-0">
          <h1 className="text-3xl font-bold">Wishlist Admin</h1>
        </div>
        <Button type="button" variant="outline" loading={signingOut} onClick={handleSignOut}>
          <LogOut aria-hidden={true} />
          Log out
        </Button>
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
            <PersonAdminTab
              person={person}
              items={items}
              updateItem={handleUpdate}
              onRemove={removeItem}
              onUnreserve={unreserveItem}
            />
          </TabsContent>
        ))}
      </Tabs>
      <div className="flex justify-center px-4 lg:px-0">
        <ItemNewDialog createItem={handleCreate} />
      </div>
    </div>
  );
};

type PersonAdminTabProps = {
  person: WishlistPerson;
  items: WishlistItem[] | undefined;
  updateItem: (itemId: Id<'items'>, values: ItemFormState) => Promise<void>;
  onRemove: (args: { id: Id<'items'> }) => Promise<unknown>;
  onUnreserve: (args: { itemId: Id<'items'> }) => Promise<unknown>;
};

function PersonAdminTab(props: PersonAdminTabProps) {
  const { person, items, updateItem, onRemove, onUnreserve } = props;

  if (items == null) {
    return <ListLoading />;
  }

  const personItems = items.filter((item) => item.requestedBy === person);

  if (personItems.length === 0) {
    return <NothingOnList />;
  }

  return personItems.map((item) => (
    <AdminItemRow key={item._id} item={item} updateItem={updateItem} onRemove={onRemove} onUnreserve={onUnreserve} />
  ));
}

type AdminItemRowProps = {
  item: WishlistItem;
  updateItem: (itemId: Id<'items'>, values: ItemFormState) => Promise<void>;
  onRemove: (args: { id: Id<'items'> }) => Promise<unknown>;
  onUnreserve: (args: { itemId: Id<'items'> }) => Promise<unknown>;
};

function AdminItemRow(props: AdminItemRowProps) {
  const { item, updateItem, onRemove, onUnreserve } = props;

  const handleEdit = useCallback(
    async (values: ItemFormState) => {
      await updateItem(item._id, values);
    },
    [item._id, updateItem]
  );

  return (
    <ItemCard
      item={item}
      sideButtons={
        <div className="flex gap-2">
          <ItemEditDialog item={item} updateItem={handleEdit} />
          <ItemDeleteDialog item={item} onRemove={onRemove} />
        </div>
      }
      bottomContent={
        item.reservation && (
          <div
            className="flex flex-col sm:flex-row gap-2 items-start sm:items-center sm:place-content-between rounded-lg
              bg-muted/60 p-3 text-sm"
          >
            <div className="flex flex-col gap-1">
              <span className="font-bold">Reserved by {item.reservation.reservedBy}</span>
              {item.reservation.comment && (
                <span className="mb-0 whitespace-pre-wrap text-foreground">Comment: {item.reservation.comment}</span>
              )}
            </div>
            <ItemUnreserveDialog item={item} onUnreserve={onUnreserve} />
          </div>
        )
      }
    />
  );
}

function toItemArgs(values: ItemFormState) {
  return {
    title: values.title.trim(),
    url: values.url.trim() || undefined,
    imageUrl: values.imageUrl.trim() || undefined,
    notes: values.notes.trim() || undefined,
    price: values.price.trim() || undefined,
    priority: values.priority.trim() || undefined,
    position: values.position,
    requestedBy: values.requestedBy,
  };
}
