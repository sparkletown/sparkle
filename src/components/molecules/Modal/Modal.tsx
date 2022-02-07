import React from "react";
import classNames from "classnames";

import { isTruthy } from "utils/types";

import { useClickOutside } from "hooks/useClickOutside";

import PortalCloseIcon from "assets/icons/icon-close-portal.svg";

import "./Modal.scss";

type ModalBackground = "dark" | "live";

interface ModalProps {
  show: boolean;
  onHide?: () => void;
  autoHide?: boolean;
  centered?: boolean;
  absolute?: boolean;
  wide?: boolean;
  background?: ModalBackground;
  closeButton?: boolean;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  show,
  onHide,
  centered,
  autoHide,
  absolute,
  wide,
  background,
  closeButton = false,
  title = "",
}) => {
  const overlayClasses = classNames("Modal", "Modal__overlay", {
    "Modal__overlay--centered": centered,
    "Modal__overlay--absolute": absolute,
    "Modal__overlay--autohide": autoHide,
  });
  const containerClasses = classNames("Modal__container", {
    "Modal__container--dark": background === "dark",
    "Modal__container--live": background === "live",
    "Modal__container--wide": wide,
  });

  const { containerRef } = useClickOutside({ onHide, autoHide });

  if (!show) {
    return null;
  }

  const hasHeader = isTruthy(title || closeButton);

  return (
    <div className={overlayClasses}>
      <div className={containerClasses} ref={containerRef}>
        {hasHeader && (
          <div className="Modal__header">
            <span className="Modal__title">{title}</span>
            {closeButton && (
              <img
                className="Modal__close"
                src={PortalCloseIcon}
                alt="close portal"
                onClick={onHide}
              />
            )}
          </div>
        )}
        <div className="Modal__body">{children}</div>
      </div>
    </div>
  );
};
