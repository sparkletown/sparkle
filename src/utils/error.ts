export const assertUnreachable = (): never => {
  throw new Error("Didn't expect to get here");
};
