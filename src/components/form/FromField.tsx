import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { ChangeEvent } from 'react';
import { useCallback, useId } from 'react';

type FormItemFieldProps<T> = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label: string;
  field: keyof T;
  onChange(field: keyof T, type: HTMLInputElement['type'], value: string): void;
};

export const FormItemField = <T,>(props: FormItemFieldProps<T>) => {
  const { label, field, onChange, ...rest } = props;
  const id = useId();

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(field, event.target.type, event.target.value);
    },
    [field, onChange]
  );

  return (
    <FieldWrapper label={label} id={id}>
      <Input {...rest} id={id} onChange={handleChange} />
    </FieldWrapper>
  );
};

type FormWrapperProps = React.PropsWithChildren & {
  label: string;
  id: string;
};

const FieldWrapper: React.FC<FormWrapperProps> = (props) => {
  const { children, label, id } = props;

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
    </Field>
  );
};
