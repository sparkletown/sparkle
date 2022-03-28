import { useEffect } from "react";

import { ATTENDEE_LAYOUT_CLASSNAME } from "settings";

export const useDisableBodyScroll = (isOpen: boolean) => {
  useEffect(() => {
    const [layoutElement] = document.getElementsByClassName(
      ATTENDEE_LAYOUT_CLASSNAME
    ) as HTMLCollectionOf<HTMLElement>;
    if (isOpen) {
      layoutElement.style.overflow = "hidden";
    } else {
      layoutElement.style.overflow = "unset";
    }

    return () => {
      layoutElement.style.overflow = "unset";
    };
  }, [isOpen]);
};
