import { Gift } from 'lucide-react';

import type { WishlistItem } from './WishlistItemCard';

type ItemCardProps = {
  item: WishlistItem;
  sideButtons?: React.ReactNode;
  bottomContent?: React.ReactNode;
};

export const ItemCard: React.FC<ItemCardProps> = (props) => {
  const { item, sideButtons, bottomContent } = props;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex gap-4 place-content-between">
        <div className="flex gap-4">
          <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <Gift aria-hidden={true} className="size-8" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
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
        {sideButtons}
      </div>
      {bottomContent}
    </div>
  );
};
