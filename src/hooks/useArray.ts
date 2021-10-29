import { useCallback, useState } from "react";

const createPlainObject = <T>() => ({} as T);

export type UseArrayOptions<T> = {
  create?: (context: { index: number }) => T;
  prepare?: (value: T, index: number, array: T[]) => T;
};

export type UseArrayResult<T> = {
  items: T[];
  add: () => T[];
  clear: () => T[];
  remove: (context: { index: number }) => T[];
  isDirty: boolean;
  setDirty: () => void;
  clearDirty: () => void;
};

export const useArray = <T>(
  array?: T[],
  options?: UseArrayOptions<T>
): UseArrayResult<T> => {
  const create = options?.create ?? createPlainObject;
  const prepared = options?.prepare ? array?.map(options.prepare) : array;

  const [items, setItems] = useState(prepared ?? []);
  const [isDirty, setIsDirty] = useState(false);

  const setDirty = useCallback(() => setIsDirty(true), [setIsDirty]);
  const clearDirty = useCallback(() => setIsDirty(false), [setIsDirty]);

  const add = useCallback(() => {
    const result: T[] = [...items, create({ index: items.length })];
    setItems(result);
    setIsDirty(true);
    return result;
  }, [items, create]);

  const remove = useCallback(
    ({ index }) => {
      const result = [...items.filter((_, i) => i !== index)];
      setItems(result);
      setIsDirty(true);
      return result;
    },
    [items]
  );

  const clear = useCallback(() => {
    const result: T[] = [];
    setItems(result);
    setIsDirty(true);
    return result;
  }, [setItems]);

  return {
    items,
    add,
    remove,
    clear,
    isDirty,
    setDirty,
    clearDirty,
  };
};
