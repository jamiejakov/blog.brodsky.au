import { cn } from '@/lib/utils';
import type { FunctionReturnType } from 'convex/server';
import { Gift } from 'lucide-react';

import type { api } from '../../../../convex/_generated/api';

export type WishlistItem = FunctionReturnType<typeof api.items.listAdmin>[number];

type ItemCardProps = {
  item: WishlistItem;
  sideButtons?: React.ReactNode;
  bottomContent?: React.ReactNode;
  /** When true, the ribbon only says "Reserved" (no reserver name). */
  hideReservedBy?: boolean;
};

export const ItemCard: React.FC<ItemCardProps> = (props) => {
  const { item, sideButtons, bottomContent, hideReservedBy = false } = props;

  return (
    <div
      className={cn(
        'relative flex flex-col gap-4 rounded-xl border border-border bg-card p-4 overflow-hidden shadow-sm',
        item.reservation != null && 'opacity-90'
      )}
    >
      {item.reservation != null && (
        <ReservedRibbon reservedBy={hideReservedBy ? undefined : item.reservation.reservedBy} />
      )}
      <div className="flex flex-wrap gap-4 place-content-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <Gift aria-hidden={true} className="size-8" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {item.price && <span className="text-sm text-muted-foreground">{item.price}</span>}
              {item.priority && <span className="text-sm text-muted-foreground">{item.priority}</span>}
            </div>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline-offset-4 hover:underline"
              >
                {item.url}
              </a>
            )}
            {item.notes && <p className="mb-0 font-light">{item.notes}</p>}
          </div>
        </div>
        {sideButtons != null && <div className={cn(item.reservation != null && 'pr-20')}>{sideButtons}</div>}
      </div>
      {bottomContent}
    </div>
  );
};

type ReservedRibbonProps = {
  reservedBy?: string;
};

const ReservedRibbon: React.FC<ReservedRibbonProps> = (props) => {
  const { reservedBy } = props;

  return (
    <div
      className={cn(
        'pointer-events-none absolute -right-8 top-4 z-10 flex w-36 rotate-45 flex-col items-center gap-0.5',
        reservedBy == null && 'top-7'
      )}
    >
      <div
        className="w-full bg-green-800 py-1 text-center text-xs font-semibold uppercase tracking-wide
          text-primary-foreground shadow-sm"
      >
        Reserved
      </div>
      {reservedBy != null && (
        <p className="mb-0 text-center text-sm font-light text-muted-foreground">by {reservedBy}</p>
      )}
    </div>
  );
};
