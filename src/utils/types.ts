export const isTruthy = <T>(item: T): item is NonNullable<T> => !!item;

export const hasElements = <T>(array?: T[] | null): boolean =>
  isTruthy(array?.length);

export const notEmpty = <T>(
  value: T | null | undefined
): value is NonNullable<T> => value !== null && value !== undefined;

export const isDefined = notEmpty;

/**
 * Return a typed array based on the provided element / array of elements.
 *
 * @example
 *   const someFunc = (fooOrFoos: string | string[]) => {
 *     const foos: string[] = asArray(fooOrFoos)
 *
 *     // do something useful with this
 *   }
 *
 * @param elementOrElements a single element, or an array of elements of the same type
 */
export const asArray = <T>(elementOrElements: T | T[]): T[] =>
  ([] as T[]).concat(elementOrElements);

export const arrayIncludes = <T>(arr?: T[], element?: T | null): boolean => {
  if (!isDefined(element) || !isDefined(arr)) return false;

  return arr.includes(element);
};
