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
import { useCallback } from 'react';

import type { Id } from '../../../../convex/_generated/dataModel';
import type { WishlistItem } from '../ItemCard';

type ItemUnreserveDialogProps = {
  item: WishlistItem;
  onUnreserve: (args: { itemId: Id<'items'> }) => Promise<unknown>;
};

export const ItemUnreserveDialog: React.FC<ItemUnreserveDialogProps> = (props) => {
  const { item, onUnreserve } = props;

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button type="button" variant="outline" size="sm">
          Clear reservation
        </Button>
      </DialogTrigger>
      <DialogContent>
        {({ close }) => <ItemUnreserveDialogContent item={item} onUnreserve={onUnreserve} close={close} />}
      </DialogContent>
    </Dialog>
  );
};

type ItemUnreserveDialogContentProps = {
  item: WishlistItem;
  onUnreserve: (args: { itemId: Id<'items'> }) => Promise<unknown>;
  close: () => void;
};

function ItemUnreserveDialogContent(props: ItemUnreserveDialogContentProps) {
  const { item, onUnreserve, close } = props;

  const handleUnreserve = useCallback(() => {
    void onUnreserve({ itemId: item._id }).then(() => {
      close();
    });
  }, [close, item._id, onUnreserve]);

  const reservedBy = item.reservation?.reservedBy;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Clear reservation</DialogTitle>
        <DialogDescription>
          Clear the reservation
          {reservedBy != null ? (
            <>
              {' '}
              by <span className="font-medium text-foreground">{reservedBy}</span>
            </>
          ) : null}{' '}
          for &ldquo;{item.title}&rdquo;?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild={true}>
          <Button type="button" variant="ghostPrimary">
            Cancel
          </Button>
        </DialogClose>
        <Button type="button" variant="destructive" onClick={handleUnreserve}>
          Clear reservation
        </Button>
      </DialogFooter>
    </>
  );
}
