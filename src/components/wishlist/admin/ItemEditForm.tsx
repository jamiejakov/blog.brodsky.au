import { FormInputField, FormRadioGroupField } from '@/components/form/FromField';
import { ValidationForm } from '@/components/form/ValidationForm';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { FieldError } from '@/components/ui/field';
import { DEFAULT_WISHLIST_PERSON, WISHLIST_PEOPLE, WISHLIST_PERSON_OPTIONS } from '@/components/wishlist/people';
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
  requestedBy: z.enum(WISHLIST_PEOPLE),
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
  requestedBy: DEFAULT_WISHLIST_PERSON,
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

  const { isSubmitted, isValid, isSubmitting, errors, isDirty } = form.formState;
  const canSave = !isSubmitted && isValid && isDirty;

  return (
    <ValidationForm form={form} onSubmit={handleSubmit} className="flex flex-col gap-3">
      <FormInputField label="Title *" name="title" />
      <FormRadioGroupField label="Requested by *" name="requestedBy" options={WISHLIST_PERSON_OPTIONS} />
      <FormInputField label="Position *" name="position" type="number" required={true} />
      <FormInputField label="URL" name="url" />
      <FormInputField label="Image URL" name="imageUrl" />
      <FormInputField label="Price" name="price" />
      <FormInputField label="Notes" name="notes" />
      <FormInputField label="Priority" name="priority" />

      {errors.root && <FieldError>{errors.root.message}</FieldError>}

      <DialogFooter>
        {cancelButton}
        <Button variant="outline" type="submit" loading={isSubmitting} disabled={!canSave}>
          Save
        </Button>
      </DialogFooter>
    </ValidationForm>
  );
};
