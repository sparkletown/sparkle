import { useEffect } from "react";

import { ATTENDEE_LAYOUT_CLASSNAME } from "settings";

// @debt: we might need to find a solution that doesn't use body element/classname, but modifies
// only the #root element
export const useDisableBodyScroll = ({ isOpen }: { isOpen: boolean }) => {
  useEffect(() => {
    const [layoutElement] = document.getElementsByClassName(
      ATTENDEE_LAYOUT_CLASSNAME
    ) as HTMLCollectionOf<HTMLElement>;
    if (!layoutElement) {
      return;
    }
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
