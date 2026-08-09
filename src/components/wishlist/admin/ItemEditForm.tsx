import { FormItemField } from '@/components/form/FromField';
import { ValidationForm } from '@/components/form/ValidationForm';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { FieldError } from '@/components/ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const optionalUrl = z.union([z.literal(''), z.url('Enter a valid URL')]);

const itemFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  url: optionalUrl,
  imageUrl: optionalUrl,
  notes: z.string(),
  price: z.string(),
  priority: z.string(),
  position: z.number({ error: 'Enter a valid position' }),
});

export type ItemFormState = z.infer<typeof itemFormSchema>;

const emptyForm: ItemFormState = {
  title: '',
  url: '',
  imageUrl: '',
  notes: '',
  price: '',
  priority: '',
  position: 0,
};

type ItemEditFormProps = {
  initial?: ItemFormState;
  onSubmit: (values: ItemFormState) => Promise<void>;
  cancelButton: React.ReactNode;
};

export const ItemEditForm: React.FC<ItemEditFormProps> = (props) => {
  const { initial = emptyForm, onSubmit, cancelButton } = props;

  const form = useForm<ItemFormState>({
    resolver: zodResolver(itemFormSchema),
    mode: 'onBlur',
    defaultValues: initial,
  });

  const handleSubmit = useCallback(
    async (data: ItemFormState) => {
      try {
        await onSubmit(data);
      } catch (caught: unknown) {
        form.setError('root', {
          message: caught instanceof Error ? caught.message : 'Could not save item',
        });
      }
    },
    [form, onSubmit]
  );

  return (
    <ValidationForm form={form} onSubmit={handleSubmit} className="flex flex-col gap-3">
      <FormItemField label="Title *" name="title" />
      <FormItemField label="Position *" name="position" type="number" required={true} />
      <FormItemField label="URL" name="url" />
      <FormItemField label="Image URL" name="imageUrl" />
      <FormItemField label="Price" name="price" />
      <FormItemField label="Notes" name="notes" />
      <FormItemField label="Priority" name="priority" />

      {form.formState.errors.root && <FieldError>{form.formState.errors.root.message}</FieldError>}

      <DialogFooter>
        {cancelButton}
        <Button type="submit" loading={form.formState.isSubmitting}>
          Save
        </Button>
      </DialogFooter>
    </ValidationForm>
  );
};
