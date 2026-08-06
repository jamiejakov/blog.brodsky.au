import { cn } from '@/lib/utils';
import * as React from 'react';

type InputFieldProps = React.ComponentProps<'input'> & {
  label: React.ReactNode;
};

export const InputField: React.FC<InputFieldProps> = (props) => {
  const { label, className, ...rest } = props;

  return (
    <FieldLabel label={label}>
      <input data-slot="input" className={cn(inputClassName, className)} {...rest} />
    </FieldLabel>
  );
};

type TextAreaFieldProps = React.ComponentProps<'textarea'> & {
  label: React.ReactNode;
};

export const TextAreaField: React.FC<TextAreaFieldProps> = (props) => {
  const { label, className, ...rest } = props;

  return (
    <FieldLabel label={label}>
      <textarea data-slot="textarea" className={cn(inputClassName, 'resize-y', className)} {...rest} />
    </FieldLabel>
  );
};

type FieldLabelProps = {
  label: React.ReactNode;
  children: React.ReactNode;
};

const FieldLabel: React.FC<FieldLabelProps> = (props) => {
  const { label, children } = props;

  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
};

const inputClassName = cn(
  'rounded-md border border-input bg-background px-3 py-2 text-sm',
  'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
);
