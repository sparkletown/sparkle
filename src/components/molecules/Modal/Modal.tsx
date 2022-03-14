import React from "react";

import { isTruthy } from "utils/types";

import { useClickOutside } from "hooks/useClickOutside";

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
    <div
      className={
        "flex h-screen overflow-y-auto overflow-x-hidden fixed right-0 left-0 top-4 z-50 justify-center items-center h-modal md:h-full md:inset-0 bg-opacity-50 bg-black"
      }
    >
      <div
        className={
          "max-h-screen relative px-4 w-full max-w-2xl h-full md:h-auto"
        }
        ref={containerRef}
      >
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
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
          <div className="p-6 space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
