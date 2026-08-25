import { useRequiredContext } from '@/lib/requiredContext';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { LayoutGroup, motion } from 'motion/react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import * as React from 'react';
import { useCallback, useId, useState } from 'react';

type TabsContextValue = {
  value: string;
  layoutId: string;
};

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function Tabs({
  className,
  orientation = 'horizontal',
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const isControlled = valueProp !== undefined;
  const value = valueProp ?? uncontrolledValue;
  const layoutId = useId();

  const handleValueChange = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange]
  );

  return (
    <TabsContext value={{ value, layoutId }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-orientation={orientation}
        orientation={orientation}
        className={cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', className)}
        {...props}
        value={value}
        onValueChange={handleValueChange}
      />
    </TabsContext>
  );
}

const tabsListVariants = cva(
  `group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground
  group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit
  group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none`,
  {
    variants: {
      variant: {
        default: 'bg-muted',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <LayoutGroup>
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </LayoutGroup>
  );
}

function TabsTrigger({ className, children, value, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { value: selected, layoutId } = useRequiredContext(TabsContext, 'TabsTrigger must be used within Tabs');
  const isActive = selected === value;

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        `relative isolate inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5
        rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-muted-foreground
        transition-[color] group-data-[orientation=vertical]/tabs:w-full
        group-data-[orientation=vertical]/tabs:justify-start hover:text-primary focus-visible:border-ring
        focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring
        disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-primary-foreground
        data-[state=active]:hover:text-primary-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0
        [&_svg:not([class*='size-'])]:size-4`,
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 z-0 rounded-md bg-primary shadow-sm scheme-light"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn('flex-1 outline-none', className)} {...props} />;
}

export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger };
