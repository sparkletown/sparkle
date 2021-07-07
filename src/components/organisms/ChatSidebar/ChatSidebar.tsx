import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

import { useChatSidebarControls, useChatSidebarInfo } from "hooks/chatSidebar";

import { ChatTypes } from "types/chat";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { VenueChat, PrivateChats } from "./components";

import "./ChatSidebar.scss";

export interface ChatSidebarProps {
  venue: WithId<AnyVenue>;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ venue }) => {
  const {
    isExpanded,
    toggleSidebar,
    chatSettings,
    selectVenueChat,
    selectPrivateChat,
  } = useChatSidebarControls();

  const { privateChatTabTitle, venueChatTabTitle } = useChatSidebarInfo(venue);

  const containerStyles = classNames("chat-sidebar", {
    "chat-sidebar--expanded": isExpanded,
  });

  const venueChatTabStyles = classNames("chat-sidebar__tab", {
    "chat-sidebar__tab--selected":
      chatSettings.openedChatType === ChatTypes.VENUE_CHAT,
  });

  const privateChatTabStyles = classNames("chat-sidebar__tab", {
    "chat-sidebar__tab--selected":
      chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT,
  });

  return (
    <div role="dialog" className={containerStyles}>
      <div className="chat-sidebar__header">
        <button
          aria-label={isExpanded ? "Hide chat" : "Show chat"}
          className="chat-sidebar__controller"
          onClick={toggleSidebar}
        >
          {isExpanded ? (
            <FontAwesomeIcon icon={faChevronRight} size="sm" />
          ) : (
            <>
              <FontAwesomeIcon icon={faChevronLeft} size="sm" />
              <FontAwesomeIcon
                className="chat-sidebar__controller__second-icon"
                icon={faCommentDots}
                size="lg"
              />
            </>
          )}
        </button>

        <div className="chat-sidebar__tabs">
          <button
            role="tab"
            aria-label={venueChatTabTitle}
            aria-selected={chatSettings.openedChatType === ChatTypes.VENUE_CHAT}
            className={venueChatTabStyles}
            onClick={selectVenueChat}
          >
            {venueChatTabTitle}
          </button>
          <button
            role="tab"
            aria-label={privateChatTabTitle}
            aria-selected={
              chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT
            }
            className={privateChatTabStyles}
            onClick={selectPrivateChat}
          >
            {privateChatTabTitle}
          </button>
        </div>
      </div>
      <div role="tabpanel" className="chat-sidebar__tab-content">
        {chatSettings.openedChatType === ChatTypes.VENUE_CHAT && (
          <VenueChat venue={venue} />
        )}
        {chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT && (
          <PrivateChats recipientId={chatSettings.recipientId} venue={venue} />
        )}
      </div>
    </div>
  );
};
