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
import { useCallback } from 'react';

import type { Id } from '../../../../convex/_generated/dataModel';
import type { WishlistItem } from '../common/ItemCard';
import { ReserveForm, type ReserveFormState } from './ReserveForm';

type ReserveDialogProps = {
  item: WishlistItem;
  onReserve: (args: { itemId: Id<'items'>; reservedBy: string; comment?: string }) => Promise<unknown>;
};

export const ReserveDialog: React.FC<ReserveDialogProps> = (props) => {
  const { item, onReserve } = props;

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button type="button" variant="outline" size="sm" className="w-fit">
          Reserve this item
        </Button>
      </DialogTrigger>
      <DialogContent>
        {({ close }) => <ReserveDialogContent item={item} onReserve={onReserve} close={close} />}
      </DialogContent>
    </Dialog>
  );
};

type ReserveDialogContentProps = {
  item: WishlistItem;
  onReserve: (args: { itemId: Id<'items'>; reservedBy: string; comment?: string }) => Promise<unknown>;
  close: () => void;
};

const ReserveDialogContent: React.FC<ReserveDialogContentProps> = (props) => {
  const { item, onReserve, close } = props;

  const handleSubmit = useCallback(
    async (values: ReserveFormState) => {
      await onReserve({
        itemId: item._id,
        reservedBy: values.reservedBy,
        comment: values.comment || undefined,
      });
      close();
    },
    [close, item._id, onReserve]
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>Reserve this item</DialogTitle>
        <DialogDescription>
          Mark <span className="font-medium text-foreground">{item.title}</span> as reserved so others know you intend
          to buy it.
        </DialogDescription>
      </DialogHeader>
      <ReserveForm onSubmit={handleSubmit} cancelButton={<CancelButton />} />
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
