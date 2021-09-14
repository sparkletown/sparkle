export const wait = async (ms: number): Promise<unknown> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
