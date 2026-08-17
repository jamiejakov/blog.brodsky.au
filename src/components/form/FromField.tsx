import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { ChangeEvent } from 'react';
import { useCallback, useId } from 'react';
import { type FieldPath, type FieldValues, useController, useFormContext } from 'react-hook-form';

type FormFieldBaseProps<T extends FieldValues> = {
  label: string;
  name: FieldPath<T>;
};

type FormInputFieldProps<T extends FieldValues> = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> &
  FormFieldBaseProps<T>;

export const FormInputField = <T extends FieldValues>(props: FormInputFieldProps<T>) => {
  const { label, name, type, ...rest } = props;
  const id = useId();
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController({ name, control });

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (type === 'number') {
        const next = event.target.value;
        field.onChange(next === '' ? undefined : event.target.valueAsNumber);
        return;
      }

      field.onChange(event);
    },
    [field, type]
  );

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        {...rest}
        {...field}
        id={id}
        type={type}
        value={field.value ?? ''}
        aria-invalid={fieldState.invalid}
        onChange={handleChange}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};

type FormRadioGroupOption = {
  value: string;
  label: string;
};

type FormRadioGroupFieldProps<T extends FieldValues> = FormFieldBaseProps<T> & {
  options: readonly FormRadioGroupOption[];
};

export const FormRadioGroupField = <T extends FieldValues>(props: FormRadioGroupFieldProps<T>) => {
  const { label, name, options } = props;
  const id = useId();
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController({ name, control });

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel id={`${id}-label`}>{label}</FieldLabel>
      <RadioGroup
        className="w-full"
        value={field.value}
        onValueChange={field.onChange}
        aria-labelledby={`${id}-label`}
        aria-invalid={fieldState.invalid}
      >
        {options.map((option) => (
          <RadioGroupItem key={option.value} value={option.value}>
            {option.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};

type FormTextAreaFieldProps<T extends FieldValues> = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> &
  FormFieldBaseProps<T>;

export const FormTextAreaField = <T extends FieldValues>(props: FormTextAreaFieldProps<T>) => {
  const { label, name, ...rest } = props;
  const id = useId();
  const { control } = useFormContext<T>();
  const { field, fieldState } = useController({ name, control });

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea {...rest} {...field} id={id} value={field.value ?? ''} aria-invalid={fieldState.invalid} />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};
