import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuthActions } from '@convex-dev/auth/react';
import { useMutation, useQuery } from 'convex/react';
import { LogOut } from 'lucide-react';
import { useCallback, useState } from 'react';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { ItemCard } from '../ItemCard';
import { NothingOnList } from '../NothingOnList';
import type { WishlistItem } from '../WishlistItemCard';
import { ItemDeleteDialog } from './ItemDeleteDialog';
import { ItemEditDialog, ItemNewDialog } from './ItemEditDialog';
import type { ItemFormState } from './ItemEditForm';
import { ItemUnreserveDialog } from './ItemUnreserveDialog';

export const AdminDashboard: React.FC = () => {
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

  if (items == null) {
    return (
      <div className="flex justify-center py-10">
        <Spinner className="size-8" />
      </div>
    );
  }

  const reservedItems = items.filter((item) => item.reservation != null);
  const availableItems = items.filter((item) => item.reservation == null);

  return (
    <div className="flex flex-col gap-6">
      <div className="px-4 lg:px-0 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Wishlist admin</h2>
          <p className="text-sm mb-0 text-muted-foreground">Manage items and read reservation comments.</p>
        </div>
        <Button type="button" variant="outline" loading={signingOut} onClick={handleSignOut}>
          <LogOut aria-hidden={true} />
          Sign out
        </Button>
      </div>
      {items.length === 0 && <NothingOnList />}
      <AdminItemSection
        title="Reserved items"
        items={reservedItems}
        updateItem={handleUpdate}
        onRemove={removeItem}
        onUnreserve={unreserveItem}
      />
      <AdminItemSection
        title="Available items"
        items={availableItems}
        updateItem={handleUpdate}
        onRemove={removeItem}
        onUnreserve={unreserveItem}
      />
      <div className="flex justify-center px-4 lg:px-0">
        <ItemNewDialog createItem={handleCreate} />
      </div>
    </div>
  );
};

type AdminItemSectionProps = {
  title: string;
  items: WishlistItem[];
  updateItem: (itemId: Id<'items'>, values: ItemFormState) => Promise<void>;
  onRemove: (args: { id: Id<'items'> }) => Promise<unknown>;
  onUnreserve: (args: { itemId: Id<'items'> }) => Promise<unknown>;
};

function AdminItemSection(props: AdminItemSectionProps) {
  const { title, items, updateItem, onRemove, onUnreserve } = props;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="px-4 lg:px-0 text-lg font-semibold">{title}</h3>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <AdminItemRow
            key={item._id}
            item={item}
            updateItem={updateItem}
            onRemove={onRemove}
            onUnreserve={onUnreserve}
          />
        ))}
      </div>
    </div>
  );
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
          <div className="flex gap-2 place-content-between rounded-lg bg-muted/60 p-3 text-sm">
            <div>
              <p className="font-bold">Reserved by {item.reservation.reservedBy}</p>
              {item.reservation.comment && (
                <p className="mb-0 whitespace-pre-wrap text-foreground">Comment: {item.reservation.comment}</p>
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
  };
}
