import { MutableRefObject, useEffect, useRef } from "react";

// @debt Should be "click", however UserAvatar in NavBar is triggering the autoHide before modal even shows up
const EVENT_TYPE = "mousedown";

type UseClickOutside = <
  C extends HTMLElement = HTMLDivElement,
  B extends HTMLElement = HTMLDivElement
>(options: {
  onHide?: () => void;
  autoHide?: boolean;
}) => {
  buttonRef: MutableRefObject<B | null>;
  containerRef: MutableRefObject<C | null>;
};

export const useClickOutside: UseClickOutside = ({ onHide, autoHide }) => {
  const buttonRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // prevents warning: Can't perform a React state update on an unmounted component.
    let isMounted = true;

    const handleClickOutside = (event: MouseEvent) => {
      if (!autoHide || !isMounted) {
        return;
      }

      const target = event.target as Node;

      // click needs to be outside the container, abort
      if ((containerRef.current as HTMLElement | null)?.contains(target)) {
        return;
      }

      // click on the close button that might be outside the container is also ignored
      if ((buttonRef.current as HTMLElement | null)?.contains(target)) {
        return;
      }

      onHide?.();
    };

    // the above is just the listener, here it is registered and unregistered from the DOM
    document.addEventListener(EVENT_TYPE, handleClickOutside);
    return () => {
      isMounted = false;
      document.removeEventListener(EVENT_TYPE, handleClickOutside);
    };
  }, [containerRef, onHide, autoHide, buttonRef]);

  return { containerRef, buttonRef };
};
