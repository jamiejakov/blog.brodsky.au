import { use } from 'react';
/**
 * Hook that throws an error if not used within the provided context.
 * Useful to make sure that some components are rendered within others.
 *
 * Example: `<MyComponent.Component>` should always be rendered in `<MyComponent.Container>`
 */
export const useRequiredContext = <T>(context: React.Context<T | undefined>, errorMessage: string): T => {
  const result = use(context);
  if (!result) {
    throw new Error(errorMessage);
  }

  return result;
};
