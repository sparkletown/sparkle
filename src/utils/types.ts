export const isTruthy = <T>(item: T): boolean => !!item;

export const hasElements = <T>(array?: T[] | null): boolean =>
  isTruthy(array?.length);
