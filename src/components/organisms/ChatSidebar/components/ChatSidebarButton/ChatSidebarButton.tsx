import React from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { Tooltip } from "components/atoms/Tooltip";

import "./ChatSidebarButton.scss";

export interface ChatSidebarButtonProps extends ContainerClassName {
  text: string;
  tooltipText: string;
  ariaLabel: string;
  icon: IconDefinition;
  onClick: () => void;
  isChatSidebarExpanded?: boolean;
  newMessage?: boolean;
}

export const ChatSidebarButton: React.FC<ChatSidebarButtonProps> = ({
  text,
  tooltipText,
  ariaLabel,
  icon,
  onClick,
  containerClassName,
  isChatSidebarExpanded,
  newMessage,
}) => {
  return (
    <Tooltip
      id={`${text}-${tooltipText}-${icon.iconName}`}
      text={tooltipText}
      placement="left"
      {...(isChatSidebarExpanded ? { show: false } : {})}
    >
      <button
        aria-label={ariaLabel}
        className={classNames("ChatSidebarButton", containerClassName)}
        onClick={onClick}
      >
        {isChatSidebarExpanded ? (
          <FontAwesomeIcon icon={faChevronRight} size="sm" />
        ) : (
          <>
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
            <div className="ChatSidebarButton__right-container">
              <div>
                <div className="ChatSidebarButton__icon-container">
                  <FontAwesomeIcon icon={icon} size="lg" />
                  {newMessage && (
                    <div className="ChatSidebarButton__new-message" />
                  )}
                </div>
                <div className="ChatSidebarButton__text">{text}</div>
              </div>
            </div>
          </>
        )}
      </button>
    </Tooltip>
  );
};
