import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthActions } from '@convex-dev/auth/react';
import { useMutation, useQuery } from 'convex/react';
import { Eye, GripVertical, LogOut } from 'lucide-react';
import { Reorder } from 'motion/react';
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
  const reorderItems = useMutation(api.items.reorder);
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
      await createItem({ ...toItemArgs(values), position: items?.length ?? 0 });
    },
    [createItem, items]
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
              onReorder={reorderItems}
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
  onReorder: (args: { orderedIds: Id<'items'>[] }) => Promise<unknown>;
};

function PersonAdminTab(props: PersonAdminTabProps) {
  const { person, items, updateItem, onRemove, onUnreserve, onReorder } = props;
  const [reordering, setReordering] = useState(false);
  const [orderedItems, setOrderedItems] = useState<WishlistItem[]>([]);
  const [originalOrderIds, setOriginalOrderIds] = useState<Id<'items'>[]>([]);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);

  const startReorder = useCallback(() => {
    if (items == null) {
      return;
    }
    const personItems = items.filter((item) => item.requestedBy === person);
    setOrderedItems(personItems);
    setOriginalOrderIds(personItems.map((item) => item._id));
    setReordering(true);
  }, [items, person]);

  const cancelReorder = useCallback(() => {
    setReordering(false);
    setOrderedItems([]);
    setOriginalOrderIds([]);
    setDragging(false);
  }, []);

  const handleReorder = useCallback((orderedIds: Id<'items'>[]) => {
    setOrderedItems((current) => {
      const byId = new Map(current.map((item) => [item._id, item]));
      return orderedIds.map((id) => byId.get(id)!);
    });
  }, []);

  const handleDragStart = useCallback(() => {
    setDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragging(false);
  }, []);

  const saveReorder = useCallback(() => {
    setSaving(true);
    void onReorder({ orderedIds: orderedItems.map((item) => item._id) })
      .then(() => {
        setReordering(false);
        setOrderedItems([]);
        setOriginalOrderIds([]);
        setDragging(false);
      })
      .finally(() => {
        setSaving(false);
      });
  }, [onReorder, orderedItems]);

  if (items == null) {
    return <ListLoading />;
  }

  const personItems = items.filter((item) => item.requestedBy === person);

  if (personItems.length === 0) {
    return <NothingOnList />;
  }

  const displayItems = reordering ? orderedItems : personItems;
  const hasReorderChanges = reordering && orderedItems.some((item, index) => item._id !== originalOrderIds[index]);

  return (
    <>
      <ReorderControls
        reordering={reordering}
        disableCancel={dragging}
        disableSave={dragging || !hasReorderChanges}
        saving={saving}
        onStart={startReorder}
        onCancel={cancelReorder}
        onSave={saveReorder}
      />

      {reordering ? (
        <Reorder.Group
          as="div"
          axis="y"
          values={displayItems.map((item) => item._id)}
          onReorder={handleReorder}
          className="flex flex-col gap-6"
        >
          {displayItems.map((item) => (
            <Reorder.Item
              key={item._id}
              value={item._id}
              as="div"
              className="relative cursor-grab active:cursor-grabbing"
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <AdminItemRow
                item={item}
                updateItem={updateItem}
                onRemove={onRemove}
                onUnreserve={onUnreserve}
                disableInteractions={true}
                className="bg-[#F9F3F5] shadow-lg"
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        displayItems.map((item) => (
          <AdminItemRow
            key={item._id}
            item={item}
            updateItem={updateItem}
            onRemove={onRemove}
            onUnreserve={onUnreserve}
          />
        ))
      )}
    </>
  );
}

type ReorderControlsProps = {
  reordering: boolean;
  disableCancel: boolean;
  disableSave: boolean;
  saving: boolean;
  onStart: () => void;
  onCancel: () => void;
  onSave: () => void;
};

function ReorderControls(props: ReorderControlsProps) {
  const { reordering, disableCancel, disableSave, saving, onStart, onCancel, onSave } = props;

  return (
    <div className="flex justify-end gap-2 px-4 lg:px-0">
      {reordering ? (
        <>
          <Button
            key="cancel"
            type="button"
            variant="ghostPrimary"
            disabled={disableCancel || saving}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            key="morphing-button"
            type="button"
            variant="outline"
            loading={saving}
            disabled={saving || disableSave}
            onClick={onSave}
          >
            Save
          </Button>
        </>
      ) : (
        <Button key="morphing-button" type="button" variant="outline" onClick={onStart}>
          <GripVertical aria-hidden={true} />
          Reorder
        </Button>
      )}
    </div>
  );
}

type AdminItemRowProps = {
  item: WishlistItem;
  updateItem: (itemId: Id<'items'>, values: ItemFormState) => Promise<void>;
  onRemove: (args: { id: Id<'items'> }) => Promise<unknown>;
  onUnreserve: (args: { itemId: Id<'items'> }) => Promise<unknown>;
  disableInteractions?: boolean;
  className?: string;
};

function AdminItemRow(props: AdminItemRowProps) {
  const { item, updateItem, onRemove, onUnreserve, disableInteractions = false, className } = props;

  const handleEdit = useCallback(
    async (values: ItemFormState) => {
      await updateItem(item._id, values);
    },
    [item._id, updateItem]
  );

  return (
    <ItemCard
      item={item}
      hideReservedBy={true}
      disableInteractions={disableInteractions}
      className={className}
      sideButtons={
        <div className="flex gap-2">
          <ItemEditDialog item={item} updateItem={handleEdit} />
          <ItemDeleteDialog item={item} onRemove={onRemove} />
        </div>
      }
      bottomContent={
        item.reservation && (
          <AdminReservationDetails key={item.reservation._creationTime} item={item} onUnreserve={onUnreserve} />
        )
      }
    />
  );
}

type AdminReservationDetailsProps = {
  item: WishlistItem;
  onUnreserve: (args: { itemId: Id<'items'> }) => Promise<unknown>;
};

function AdminReservationDetails(props: AdminReservationDetailsProps) {
  const { item, onUnreserve } = props;
  const [revealed, setRevealed] = useState(false);

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const reservation = item.reservation;
  if (reservation == null) {
    return null;
  }

  return (
    <div
      className="flex flex-col sm:flex-row gap-2 items-start sm:items-center sm:place-content-between rounded-lg
        bg-muted/60 p-3 text-sm"
    >
      <div className="flex flex-col gap-1">
        {revealed ? (
          <span className="font-bold">Reserved by {reservation.reservedBy}</span>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto w-fit px-0 text-muted-foreground hover:text-foreground"
            onClick={handleReveal}
          >
            <Eye aria-hidden={true} />
            Reveal who reserved
          </Button>
        )}
        {reservation.comment && (
          <span className="mb-0 whitespace-pre-wrap text-foreground">Comment: {reservation.comment}</span>
        )}
      </div>
      <ItemUnreserveDialog item={item} onUnreserve={onUnreserve} />
    </div>
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
    requestedBy: values.requestedBy,
  };
}
