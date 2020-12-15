import { useState, useCallback } from "react";

export const useDynamicInput = (questions?: number) => {
  const defaultCounter = questions ?? 0;
  const defaultIndexes = questions
    ? Array.from(Array(questions)).map((_, index) => index)
    : [];

  const [counter, setCounter] = useState(defaultCounter);
  const [indexes, setIndexes] = useState<number[]>(defaultIndexes);

  const add = useCallback(() => {
    setIndexes((prevIndexes) => [...prevIndexes, counter]);
    setCounter((prevCounters) => prevCounters + 1);
  }, [counter]);

  const remove = useCallback(
    (index: number) => () => {
      setIndexes((prevIndexes) => [...prevIndexes.filter((i) => i !== index)]);
      setCounter((prevCounters) => prevCounters - 1);
    },
    []
  );

  const clear = useCallback(() => {
    setIndexes([]);
    setCounter(0);
  }, []);

  return {
    counter,
    indexes,
    add,
    remove,
    clear,
  };
};
