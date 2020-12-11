export const filterUniqueKeys = (
  userId: string,
  index: number,
  arr: string[]
) => arr.indexOf(userId) === index;
