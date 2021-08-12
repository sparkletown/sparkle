export const arrayHasElements = <T>(arr: T[] | undefined): arr is T[] => {
  return !!arr && arr.length > 0;
};
