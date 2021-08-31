import React, { PropsWithChildren } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import "./ChatSidebarButton.scss";

export interface ChatSidebarButtonProps extends ContainerClassName {
  text: string;
  ariaLabel: string;
  icon: IconDefinition;
  onClick: () => void;
  isExpanded?: boolean;
}

export const ChatSidebarButton: React.FC<
  PropsWithChildren<ChatSidebarButtonProps>
> = ({
  text,
  ariaLabel,
  icon,
  onClick,
  containerClassName,
  children,
  isExpanded,
}) => {
  return (
    <button
      aria-label={ariaLabel}
      className={classNames("ChatSidebarButton", containerClassName)}
      onClick={onClick}
    >
      {isExpanded ? (
        <FontAwesomeIcon icon={faChevronRight} size="sm" />
      ) : (
        <>
          <FontAwesomeIcon icon={faChevronLeft} size="sm" />
          <div className="ChatSidebarButton__right-container">
            <div>
              <FontAwesomeIcon icon={icon} size="lg" />
              <div className="ChatSidebarButton__text">{text}</div>
              {children}
            </div>
          </div>
        </>
      )}
    </button>
  );
};
