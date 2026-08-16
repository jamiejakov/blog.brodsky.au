import { FormInputField, FormTextAreaField } from '@/components/form/FromField';
import { ValidationForm } from '@/components/form/ValidationForm';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { FieldError } from '@/components/ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const reserveFormSchema = z.object({
  reservedBy: z.string().trim().min(1, 'Name is required'),
  comment: z.string(),
});

export type ReserveFormState = z.infer<typeof reserveFormSchema>;

const emptyForm: ReserveFormState = {
  reservedBy: '',
  comment: '',
};

type ReserveFormProps = {
  onSubmit: (values: ReserveFormState) => Promise<void>;
  cancelButton: React.ReactNode;
};

export const ReserveForm: React.FC<ReserveFormProps> = (props) => {
  const { onSubmit, cancelButton } = props;

  const form = useForm<ReserveFormState>({
    resolver: zodResolver(reserveFormSchema),
    mode: 'onBlur',
    defaultValues: emptyForm,
  });

  const handleSubmit = useCallback(
    async (data: ReserveFormState) => {
      try {
        await onSubmit(data);
      } catch (caught: unknown) {
        form.setError('root', {
          message: caught instanceof Error ? caught.message : 'Could not reserve this item',
        });
      }
    },
    [form, onSubmit]
  );

  const { isSubmitted, isValid, isSubmitting, errors, isDirty } = form.formState;
  const canSave = !isSubmitted && isValid && isDirty;

  return (
    <ValidationForm form={form} onSubmit={handleSubmit} className="flex flex-col gap-3">
      <FormInputField label="Name *" name="reservedBy" placeholder="Eren Yeager" autoFocus={true} />
      <FormTextAreaField
        label="Comment"
        name="comment"
        rows={3}
        placeholder="Optional — only the Brodsky family will see this"
      />

      {errors.root && <FieldError>{errors.root.message}</FieldError>}

      <DialogFooter>
        {cancelButton}
        <Button variant="outline" type="submit" loading={isSubmitting} disabled={!canSave}>
          Reserve
        </Button>
      </DialogFooter>
    </ValidationForm>
  );
};
