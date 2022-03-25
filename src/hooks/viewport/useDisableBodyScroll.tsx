import { useEffect } from "react";

export const useDisableBodyScroll = (isOpen: boolean) => {
  useEffect(() => {
    const [layoutElement] = document.getElementsByClassName(
      "AttendeeLayout"
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
