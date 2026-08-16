import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useCallback } from 'react';

import type { WishlistItem } from '../ItemCard';
import { ItemEditForm, type ItemFormState } from './ItemEditForm';

type ItemEditDialogProps = {
  updateItem: (values: ItemFormState) => Promise<void>;
  item: WishlistItem;
};

export const ItemEditDialog: React.FC<ItemEditDialogProps> = (props) => {
  const { updateItem, item } = props;

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button type="button" variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit item</DialogTitle>
          <DialogDescription>Update the details for this wishlist item.</DialogDescription>
        </DialogHeader>
        <ItemEditForm initial={toItemFormState(item)} onSubmit={updateItem} cancelButton={<CancelButton />} />
      </DialogContent>
    </Dialog>
  );
};

function toItemFormState(item: WishlistItem): ItemFormState {
  return {
    title: item.title,
    url: item.url ?? '',
    imageUrl: item.imageUrl ?? '',
    notes: item.notes ?? '',
    price: item.price ?? '',
    priority: item.priority ?? '',
    position: item.position,
    requestedBy: item.requestedBy,
  };
}

type ItemNewDialogProps = {
  createItem: (values: ItemFormState) => Promise<void>;
};

export const ItemNewDialog: React.FC<ItemNewDialogProps> = (props) => {
  const { createItem } = props;

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button type="button" variant="outline">
          <Plus aria-hidden={true} />
          Create new
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-lg">
        {({ close }) => <Content createItem={createItem} close={close} />}
      </DialogContent>
    </Dialog>
  );
};

type ContentProps = {
  createItem: (values: ItemFormState) => Promise<void>;
  close: () => void;
};

const Content: React.FC<ContentProps> = (props) => {
  const { createItem, close } = props;

  const handleSubmit = useCallback(
    async (values: ItemFormState) => {
      await createItem(values);
      close();
    },
    [createItem, close]
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create new item</DialogTitle>
        <DialogDescription>Add a new item to the wishlist.</DialogDescription>
      </DialogHeader>
      <ItemEditForm onSubmit={handleSubmit} cancelButton={<CancelButton />} />
    </>
  );
};

const CancelButton: React.FC = () => {
  return (
    <DialogClose asChild={true}>
      <Button type="button" variant="ghostPrimary">
        Cancel
      </Button>
    </DialogClose>
  );
};
