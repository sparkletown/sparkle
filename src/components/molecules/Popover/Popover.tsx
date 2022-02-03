import React, { ReactNode, useRef } from "react";

import { useClickOutside } from "hooks/useClickOutside";
import { useShowHide } from "hooks/useShowHide";

import "./Popover.scss";

type PopoverProps = {
  overlay: ReactNode;
  defaultShow?: boolean;
  closeRoot?: boolean;
  className?: string;
};

export const Popover: React.FC<PopoverProps> = ({
  children,
  overlay,
  defaultShow = false,
  closeRoot = false,
  className,
}) => {
  const { isShown, toggle, hide } = useShowHide(defaultShow);

  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  useClickOutside({ ref: wrapperRef, hide, closeRoot, buttonRef });

  return (
    <div>
      {isShown && (
        <div className={`Popover__overlay ${className}`} ref={wrapperRef}>
          {overlay}
        </div>
      )}
      <div onClick={toggle} ref={buttonRef}>
        {children}
      </div>
    </div>
  );
};
