/**
 * Checks that a value exists (not null or undefined)
 *
 * @param value value
 * @param message optional message to put in the error
 * @throw if `value` is null or undefined
 * @return `value`
 */
export function checkExists<T>(value: T | null | undefined, message?: string) {
  if (value == null) {
    throw new Error(message ?? 'The value received is null');
  }

  return value;
}

/**
 * Checks that a value is true, throws error if it is not
 *
 * @param value to check the state of
 * @param message optional message to put in the error
 */
export function checkState(value: boolean, message?: string) {
  if (!value) {
    throw new Error(message ?? 'Invalid state');
  }
}
