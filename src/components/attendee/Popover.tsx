import { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import { Placement } from "popper.js";

import { POPOVER_CONTAINER_ID } from "settings";

export interface PopoverProps {
  referenceElement?: Element | null;
  placement?: Placement;
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  referenceElement,
  placement = "auto",
}) => {
  const popoverContainerElement = document.querySelector(
    `#${POPOVER_CONTAINER_ID}`
  );
  const options = useMemo(
    () => ({
      placement,
    }),
    [placement]
  );

  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles: popperStyles, attributes: popperAttributes } = usePopper(
    referenceElement,
    popperElement,
    options
  );

  return (
    popoverContainerElement &&
    // using a #${POPOVER_CONTAINER_ID} element as a parent of the Popover component
    // to prevent issues with layout and make Popover to always appear on the top of the content
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
