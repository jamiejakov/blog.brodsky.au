import type { SubmitEvent } from 'react';
import { useCallback } from 'react';
import { type FieldValues, FormProvider, type SubmitHandler, type UseFormReturn } from 'react-hook-form';

type ValidationFormProps<T extends FieldValues> = Omit<React.ComponentProps<'form'>, 'onSubmit' | 'noValidate'> &
  React.PropsWithChildren & {
    form: UseFormReturn<T>;
    onSubmit: SubmitHandler<T>;
  };

export const ValidationForm = <T extends FieldValues>(props: ValidationFormProps<T>) => {
  const { form, onSubmit, children, ...formProps } = props;

  const handleSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      void form.handleSubmit(onSubmit)(event);
    },
    [form, onSubmit]
  );

  return (
    <FormProvider {...form}>
      <form noValidate={true} onSubmit={handleSubmit} {...formProps}>
        {children}
      </form>
    </FormProvider>
  );
};
