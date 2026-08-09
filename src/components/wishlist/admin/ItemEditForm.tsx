import { FormItemField } from '@/components/form/FromField';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { FieldError, FieldGroup } from '@/components/ui/field';
import type { SubmitEvent } from 'react';
import { useCallback, useState } from 'react';

export type ItemFormState = {
  title: string;
  url: string;
  imageUrl: string;
  notes: string;
  price: string;
  priority: string;
  position: number;
};

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
  const [values, setValues] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = useCallback((field: keyof ItemFormState, type: HTMLInputElement['type'], value: string) => {
    const formattedValue = type === 'number' ? Number(value) : value;
    setValues((current) => ({ ...current, [field]: formattedValue }));
  }, []);

  const handleSubmit = useCallback(
    (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitting(true);
      setError(null);
      void onSubmit(values)
        .catch((caught: unknown) => {
          setError(caught instanceof Error ? caught.message : 'Could not save item');
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
    [onSubmit, values]
  );

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-3">
        <FormItemField label="Title *" field="title" value={values.title} onChange={setField} />
        <FormItemField
          label="Position *"
          field="position"
          type="number"
          required={true}
          value={values.position}
          onChange={setField}
        />
        <FormItemField label="URL" field="url" value={values.url} onChange={setField} />
        <FormItemField label="Image URL" field="imageUrl" value={values.imageUrl} onChange={setField} />
        <FormItemField label="Price" field="price" value={values.price} onChange={setField} />
        <FormItemField label="Notes" field="notes" value={values.notes} onChange={setField} />
        <FormItemField label="Priority" field="priority" value={values.priority} onChange={setField} />

        {error && <FieldError>{error}</FieldError>}

        <DialogFooter>
          {cancelButton}
          <Button type="submit" disabled={submitting || !values.title.trim()} loading={submitting}>
            Save
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
};
