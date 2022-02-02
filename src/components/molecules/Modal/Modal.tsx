import React, { useRef } from "react";
import classNames from "classnames";

import { useClickOutside } from "hooks/useClickOutside";

import "./Modal.scss";

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
  overlayClose?: boolean;
  isCentered?: boolean;
  absolute?: boolean;
  wide?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  className = "",
  isCentered,
  overlayClose,
  absolute,
  wide,
}) => {
  const overlayClasses = classNames("Modal__overlay", {
    "Modal__overlay-centered": isCentered,
    "Modal__overlay-absolute": absolute,
  });
  const containerClasses = classNames(`Modal__container ${className}`, {
    "Modal__container-custom": !className,
    "Modal__container-wide": wide,
  });

  const containerRef = useRef(null);

  useClickOutside({
    ref: containerRef,
    hide: onClose,
    closeRoot: overlayClose,
  });
  if (!isOpen) {
    return null;
  }

  return (
    <div className={overlayClasses}>
      <div className={containerClasses} ref={containerRef}>
        {children}
      </div>
    </div>
  );
};
