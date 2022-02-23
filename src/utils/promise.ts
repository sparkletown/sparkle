const wait = async (ms: number): Promise<unknown> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const waitAtLeast = async <T>(
  ms: number,
  other: Promise<T>
): Promise<T> => (await Promise.all([other, wait(ms)]))[0] as T;
