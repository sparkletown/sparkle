export const isTruthy = <T>(item: T): item is NonNullable<T> => !!item;

export const hasElements = <T>(array?: T[] | null): boolean =>
  isTruthy(array?.length);

export const notEmpty = <T>(
  value: T | null | undefined
): value is NonNullable<T> => value !== null && value !== undefined;

export const isDefined = notEmpty;
