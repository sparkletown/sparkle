import { useCallback, useState } from "react";

const createPlainObject = <T>() => ({} as T);

export type UseArrayOptions<T> = {
  create?: (context: { index: number }) => T;
  prepare?: (value: T, index: number, array: T[]) => T;
};

export type UseArrayAdd<T> = () => T[];
export type UseArraySet<T> = (options: { index: number; item: T }) => T[];
export type UseArrayUpdateCallback<T> = (context: {
  index: number;
  item: T;
}) => T;
export type UseArrayUpdate<T> = (options: {
  index: number;
  callback: UseArrayUpdateCallback<T>;
}) => T[];
export type UseArrayRemove<T> = (options: { index: number }) => T[];
export type UseArrayClear<T> = () => T[];

export type UseArrayResult<T> = {
  items: T[];
  add: UseArrayAdd<T>;
  set: UseArraySet<T>;
  update: UseArrayUpdate<T>;
  clear: UseArrayClear<T>;
  remove: UseArrayRemove<T>;
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

  const add: UseArrayAdd<T> = useCallback(() => {
    const result: T[] = [...items, create({ index: items.length })];
    setItems(result);
    setIsDirty(true);
    return result;
  }, [items, create]);

  const set: UseArraySet<T> = useCallback(
    ({ index, item }) => {
      const before = items.slice(0, index);
      const after = items.slice(index + 1);
      const result: T[] = [...before, item, ...after];
      setItems(result);
      setIsDirty(true);
      return result;
    },
    [items]
  );

  const update: UseArrayUpdate<T> = useCallback(
    ({ index, callback }) => {
      const itemBefore = items?.[index];
      const itemAfter = callback({ index, item: itemBefore });
      return set({ index, item: itemAfter });
    },
    [items, set]
  );

  const remove: UseArrayRemove<T> = useCallback(
    ({ index }) => {
      const result = [...items.filter((_, i) => i !== index)];
      setItems(result);
      setIsDirty(true);
      return result;
    },
    [items]
  );

  const clear: UseArrayClear<T> = useCallback(() => {
    const result: T[] = [];
    setItems(result);
    setIsDirty(true);
    return result;
  }, [setItems]);

  return {
    items,
    add,
    set,
    update,
    remove,
    clear,
    isDirty,
    setDirty,
    clearDirty,
  };
};
