import React from "react";

import { isTruthy } from "utils/types";

import { useClickOutside } from "hooks/useClickOutside";

import { modalTailwind, modalWrapper } from "./Modal.tailwind";

import PortalCloseIcon from "assets/icons/icon-close-portal.svg";

import "./Modal.scss";

type ModalBackgroundVariant = "dark" | "live";

interface ModalProps {
  show: boolean;
  onHide?: () => void;
  autoHide?: boolean;
  centered?: boolean;
  absolute?: boolean;
  wide?: boolean;
  bgVariant?: ModalBackgroundVariant;
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
  bgVariant,
  closeButton = false,
  title = "",
}) => {
  const { containerRef } = useClickOutside({ onHide, autoHide });

  if (!show) {
    return null;
  }

  const hasHeader = isTruthy(title || closeButton);

  return (
    <div className={modalTailwind}>
      <div
        className={
          "max-h-screen relative px-4 w-full max-w-2xl h-full md:h-auto sm:max-w-lg sm:w-full"
        }
        ref={containerRef}
      >
        <div className={modalWrapper}>
          {hasHeader && (
            <div className="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
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
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
