import { useCallback, useState } from "react";

const createPlainObject = <T>() => ({} as T);

export type UseArrayOptions<T> = {
  array: T[];
  create?: <T>(context: { index: number }) => T;
};

export type UseArrayResult<T> = {
  items: T[];
  add: () => T[];
  clear: () => T[];
  remove: (context: { index: number }) => T[];
};

export const useArray = <T>(
  options?: T[] | UseArrayOptions<T>
): UseArrayResult<T> => {
  const array = Array.isArray(options) ? options ?? [] : options?.array ?? [];

  const create = Array.isArray(options)
    ? createPlainObject
    : options?.create ?? createPlainObject;

  const [items, setItems] = useState(array);

  const add = useCallback(() => {
    const result: T[] = [...items, create({ index: items.length })];
    setItems(result);
    return result;
  }, [items, create]);

  const remove = useCallback(
    ({ index }) => {
      const result = [...items.filter((_, i) => i !== index)];
      setItems(result);
      return result;
    },
    [items]
  );

  const clear = useCallback(() => {
    const result: T[] = [];
    setItems(result);
    return result;
  }, [setItems]);

  return {
    items,
    add,
    remove,
    clear,
  };
};
