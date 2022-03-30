import { useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";

import { POPOVER_CONTAINER_ID } from "settings";

export interface PopoverProps {
  referenceElement?: Element | null;
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  referenceElement,
}) => {
  const popoverContainerElement = document.querySelector(
    `#${POPOVER_CONTAINER_ID}`
  );

  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles: popperStyles, attributes: popperAttributes } = usePopper(
    referenceElement,
    popperElement
  );

  return (
    popoverContainerElement &&
    ReactDOM.createPortal(
      <div
        ref={setPopperElement}
        style={popperStyles.popper}
        {...popperAttributes.popper}
      >
        {children}
      </div>,
      popoverContainerElement
    )
  );
};
