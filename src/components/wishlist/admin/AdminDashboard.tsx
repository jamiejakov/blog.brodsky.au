import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuthActions } from '@convex-dev/auth/react';
import { useMutation, useQuery } from 'convex/react';
import { LogOut, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { WishlistItem } from '../WishlistItemCard';
import { ItemEditDialog, ItemNewDialog } from './ItemEditDialog';
import type { ItemFormState } from './ItemEditForm';

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

  return (
    <div className="flex flex-col gap-8">
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

      <div className="px-4 lg:px-0">
        <ItemNewDialog createItem={handleCreate} />
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <AdminItemRow
            key={item._id}
            item={item}
            updateItem={handleUpdate}
            onRemove={removeItem}
            onUnreserve={unreserveItem}
          />
        ))}
      </div>
    </div>
  );
};

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

  const handleRemove = useCallback(() => {
    if (window.confirm(`Delete "${item.title}"?`)) {
      void onRemove({ id: item._id });
    }
  }, [item._id, item.title, onRemove]);

  const handleUnreserve = useCallback(() => {
    void onUnreserve({ itemId: item._id });
  }, [item._id, onUnreserve]);

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-sm text-muted-foreground">
            {[item.price, item.notes, item.priority ? `Priority: ${item.priority}` : null]
              .filter(Boolean)
              .join(' · ') || 'No details'}
          </p>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-primary underline-offset-4 hover:underline"
            >
              {item.url}
            </a>
          )}
        </div>

        <div className="flex gap-2">
          <ItemEditDialog item={item} updateItem={handleEdit} />
          <Button type="button" variant="destructive" size="sm" onClick={handleRemove}>
            <Trash2 aria-hidden={true} />
            Delete
          </Button>
        </div>
      </div>

      {item.reservation ? (
        <div className="mt-4 rounded-lg bg-muted/60 p-3 text-sm">
          <p className="font-medium text-primary">Reserved by {item.reservation.reservedBy}</p>
          {item.reservation.comment && (
            <p className="mt-2 whitespace-pre-wrap text-foreground">Comment: {item.reservation.comment}</p>
          )}
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={handleUnreserve}>
            Clear reservation
          </Button>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Available</p>
      )}
    </article>
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
