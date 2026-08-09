import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { useCallback } from 'react';

import type { Id } from '../../../../convex/_generated/dataModel';
import type { WishlistItem } from '../WishlistItemCard';

type ItemDeleteDialogProps = {
  item: WishlistItem;
  onRemove: (args: { id: Id<'items'> }) => Promise<unknown>;
};

export const ItemDeleteDialog: React.FC<ItemDeleteDialogProps> = (props) => {
  const { item, onRemove } = props;

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button type="button" variant="destructive" size="sm">
          <Trash2 aria-hidden={true} />
          <span className="sr-only">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        {({ close }) => <ItemDeleteDialogContent item={item} onRemove={onRemove} close={close} />}
      </DialogContent>
    </Dialog>
  );
};

type ItemDeleteDialogContentProps = {
  item: WishlistItem;
  onRemove: (args: { id: Id<'items'> }) => Promise<unknown>;
  close: () => void;
};

function ItemDeleteDialogContent(props: ItemDeleteDialogContentProps) {
  const { item, onRemove, close } = props;

  const handleRemove = useCallback(() => {
    void onRemove({ id: item._id }).then(() => {
      close();
    });
  }, [close, item._id, onRemove]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete item</DialogTitle>
        <DialogDescription>Delete &ldquo;{item.title}&rdquo;? This cannot be undone.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild={true}>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="button" variant="destructive" onClick={handleRemove}>
          Delete
        </Button>
      </DialogFooter>
    </>
  );
}
