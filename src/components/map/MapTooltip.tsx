import React from 'react';

import { isoToFlag } from './iso';

export type TooltipState = {
  name: string;
  iso2: string;
  isVisited: boolean;
  x: number;
  y: number;
};

type MapTooltipProps = {
  tooltip: TooltipState;
};

export const MapTooltip: React.FC<MapTooltipProps> = (props) => {
  const { tooltip } = props;

  return (
    <div
      className="pointer-events-none fixed z-50 px-3 py-2 text-sm rounded-md bg-popover text-popover-foreground border
        border-border shadow-md"
      style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
    >
      <span className="mr-1.5 text-base" role="img" aria-label={`Flag of ${tooltip.name}`}>
        {isoToFlag(tooltip.iso2)}
      </span>
      <span className="font-medium">{tooltip.name}</span>
      <span className="text-muted-foreground"> — {tooltip.isVisited ? 'visited' : 'not visited'}</span>
    </div>
  );
};
