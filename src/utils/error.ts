export const assertUnreachable = (_: never) => {
  throw new Error("Didn't expect to get here");
};
