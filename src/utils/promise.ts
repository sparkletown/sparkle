export const wait = async (ms: number): Promise<unknown> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const waitAtLeast = async <T>(
  other: Promise<T>,
  ms: number
): Promise<T> => (await Promise.all([other, wait(ms)]))[0] as T;
