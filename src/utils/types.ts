export const isTruthy = <T>(item: T): boolean => !!item;

export const hasElements = <T>(array?: T[] | null): boolean =>
  isTruthy(array?.length);

export const notEmpty = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;
