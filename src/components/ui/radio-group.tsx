import { useRequiredContext } from '@/lib/requiredContext';
import { cn } from '@/lib/utils';
import { LayoutGroup, motion } from 'motion/react';
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import * as React from 'react';
import { useCallback, useId, useState } from 'react';

type RadioGroupContextValue = {
  value: string;
  layoutId: string;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined);

function RadioGroup({
  className,
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
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
    <RadioGroupContext value={{ value, layoutId }}>
      <LayoutGroup>
        <RadioGroupPrimitive.Root
          data-slot="radio-group"
          className={cn(
            `group/radio-group inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-0.75
            text-muted-foreground`,
            className
          )}
          {...props}
          value={value}
          onValueChange={handleValueChange}
        />
      </LayoutGroup>
    </RadioGroupContext>
  );
}

function RadioGroupItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const { value: selected, layoutId } = useRequiredContext(
    RadioGroupContext,
    'RadioGroupItem must be used within RadioGroup'
  );
  const isActive = selected === value;

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      value={value}
      className={cn(
        `relative inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md
        border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-[color]
        hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
        focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50
        data-[state=checked]:text-foreground dark:text-muted-foreground dark:hover:text-foreground
        dark:data-[state=checked]:text-foreground`,
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 z-0 rounded-md bg-background shadow-sm dark:border-input dark:bg-input/30"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
