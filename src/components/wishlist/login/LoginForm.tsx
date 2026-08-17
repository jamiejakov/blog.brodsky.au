import { FormInputField } from '@/components/form/FromField';
import { ValidationForm } from '@/components/form/ValidationForm';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup } from '@/components/ui/field';
import { useAuthActions } from '@convex-dev/auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const passwordField = z.string().min(8, 'Password must be at least 8 characters');

const loginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: passwordField,
  confirmPassword: z.string(),
});

const signUpSchema = z
  .object({
    email: z.email('Enter a valid email'),
    password: passwordField,
    confirmPassword: passwordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<'login' | 'signUp'>('login');

  const form = useForm<FormValues>({
    resolver: zodResolver(step === 'signUp' ? signUpSchema : loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = useCallback(
    async (data: FormValues) => {
      const formData = new FormData();
      formData.set('email', data.email);
      formData.set('password', data.password);
      formData.set('flow', step === 'login' ? 'signIn' : 'signUp');

      try {
        await signIn('password', formData);
      } catch (caught: unknown) {
        form.setError('root', {
          message: caught instanceof Error ? caught.message : 'Login failed',
        });
      }
    },
    [form, signIn, step]
  );

  const handleToggleStep = useCallback(() => {
    setStep((current) => (current === 'login' ? 'signUp' : 'login'));
    form.clearErrors();
  }, [form]);

  return (
    <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Admin login</h2>

      <ValidationForm form={form} className="mt-6" onSubmit={onSubmit}>
        <FieldGroup className="gap-4">
          <FormInputField label="Email" name="email" type="email" autoComplete="email" />
          <FormInputField
            label="Password"
            name="password"
            type="password"
            autoComplete={step === 'signUp' ? 'new-password' : 'current-password'}
          />
          {step === 'signUp' && (
            <FormInputField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
            />
          )}
          {form.formState.errors.root && <FieldError>{form.formState.errors.root.message}</FieldError>}
          <Field>
            <Button type="submit" loading={form.formState.isSubmitting}>
              {submitButtonLabel[step]}
            </Button>
            <Button type="button" variant="ghostPrimary" onClick={handleToggleStep}>
              {toggleButtonLabel[step]}
            </Button>
          </Field>
        </FieldGroup>
      </ValidationForm>
    </div>
  );
};

const submitButtonLabel = {
  login: 'Log in',
  signUp: 'Create account',
};

const toggleButtonLabel = {
  login: 'First time? Create your account',
  signUp: 'Already have an account? Log in',
};
