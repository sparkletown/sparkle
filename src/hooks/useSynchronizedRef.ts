import { useMemo, useRef } from "react";

export const useSynchronizedRef = <T>(value: T) => {
  const ref = useRef<T>(value);
  useMemo(() => {
    ref.current = value;
  }, [value]);
  return ref;
};
