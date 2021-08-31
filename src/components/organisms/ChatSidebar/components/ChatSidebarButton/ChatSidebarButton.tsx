import React, { useRef } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
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
  tooltipText: string;
  ariaLabel: string;
  icon: IconDefinition;
  onClick: () => void;
  isExpanded?: boolean;
  newMessage?: boolean;
}

export const ChatSidebarButton: React.FC<ChatSidebarButtonProps> = ({
  text,
  tooltipText,
  ariaLabel,
  icon,
  onClick,
  containerClassName,
  isExpanded,
  newMessage,
}) => {
  const buttonRef = useRef(null);

  return (
    <OverlayTrigger
      placement="left"
      {...(isExpanded ? { show: false } : {})}
      overlay={
        tooltipText ? (
          <Tooltip id={`${text}-${tooltipText}-${icon.iconName}`}>
            {tooltipText}
          </Tooltip>
        ) : (
          <></>
        )
      }
    >
      <button
        aria-label={ariaLabel}
        className={classNames("ChatSidebarButton", containerClassName)}
        onClick={onClick}
        ref={buttonRef}
      >
        {isExpanded ? (
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
    </OverlayTrigger>
  );
};
