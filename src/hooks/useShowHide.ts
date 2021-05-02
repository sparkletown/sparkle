import { useCallback, useState } from "react";

export const useShowHide = () => {
  const [isShown, setShown] = useState<boolean>(false);

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
