// NOTE: unique constant that helps filter only this kind of console messages
const UNIQUE = "*promise*";

export const withLog = <T>(tag: string, promise: T): T => {
  if (!(promise instanceof Promise)) {
    return promise;
  }

  promise.catch((reason) => console.warn(UNIQUE, tag, "rejection:", reason));
  return promise;
};

export const justLog = <T>(tag: string, promise: T): void => {
  if (!(promise instanceof Promise)) {
    return;
  }

  promise.catch((reason) => console.warn(UNIQUE, tag, "rejection:", reason));
};
