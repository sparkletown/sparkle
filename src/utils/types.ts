export const isTruthy = <T>(item: T): boolean => !!item;

export const hasElements = (array: any[] | null | undefined): boolean =>
  isTruthy(array?.length);
