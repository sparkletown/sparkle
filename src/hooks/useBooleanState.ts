import { useCallback, useState } from "react";

export const useBooleanState = (
  initial?: boolean
): [boolean, () => void, () => void] => {
  const [state, setState] = useState(initial === undefined ? false : initial);

  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);

  return [state, setTrue, setFalse];
};
