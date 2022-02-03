import React, { ReactNode } from "react";

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
  const { isShown, toggle, hide: onHide } = useShowHide(defaultShow);

  const { containerRef, buttonRef } = useClickOutside({
    onHide,
    autoHide: closeRoot,
  });

  return (
    <div>
      {isShown && (
        <div className={`Popover__overlay ${className}`} ref={containerRef}>
          {overlay}
        </div>
      )}
      <div onClick={toggle} ref={buttonRef}>
        {children}
      </div>
    </div>
  );
};
