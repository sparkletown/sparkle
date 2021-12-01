export const isTruthy = <T>(item: T): item is NonNullable<T> => !!item;

export const isDefined = <T>(
  value: T | null | undefined
): value is NonNullable<T> => value !== null && value !== undefined;

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

export const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??[-+=&;%@.\w_]*#?[.!/\\\w]*)?)/;
