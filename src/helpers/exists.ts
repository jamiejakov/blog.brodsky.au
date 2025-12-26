/**
 * Instead of:
 * ```ts
 *   const xs: (string | undefined)[] = ...
 *   const ys = xs
 *       .map(x => x.foo)
 *       .filter((s): s is string => s != null);
 * ```
 *
 * prefer:
 * ```ts
 *   const xs: (string | undefined)[] = ...
 *   const ys = xs.map(x => x.foo).filter(exists);
 * ```
 *
 * This can be deleted if TypeScript can ever deduce the type of `arrWithNulls.filter(o=>o!=null)`.
 *
 * Ref: https://github.com/Microsoft/TypeScript/issues/16069
 */
export function exists<T>(t: T | undefined | null): t is T {
  return t != null;
}
