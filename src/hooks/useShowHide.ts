import { useCallback, useMemo, useState } from "react";

export const useShowHide = (isShownByDefault: boolean = false) => {
  const [isShown, setShown] = useState<boolean>(isShownByDefault);

  const show = useCallback(() => {
    console.log("show");
    setShown(true);
  }, []);

  const hide = useCallback(() => {
    setShown(false);
  }, []);

  const toggle = useCallback(() => {
    console.log("toggle");
    setShown((prev) => !prev);
  }, []);

  return useMemo(
    () => ({
      isShown,

      show,
      hide,
      toggle,
      setShown,
    }),
    [hide, isShown, show, toggle]
  );
};
