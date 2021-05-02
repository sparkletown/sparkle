import { useCallback, useState } from "react";

export const useShowHide = (isShownByDefault: boolean = false) => {
  const [isShown, setShown] = useState<boolean>(isShownByDefault);

  const show = useCallback(() => {
    setShown(true);
  }, []);

  const hide = useCallback(() => {
    setShown(false);
  }, []);

  const toggle = useCallback(() => {
    setShown((prev) => !prev);
  }, []);

  return {
    isShown,

    show,
    hide,
    toggle,
  };
};
