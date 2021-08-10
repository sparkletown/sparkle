import React from "react";
import {
  faChevronLeft,
  faChevronRight,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { isEqual } from "lodash";

import { ChatTypes } from "types/chat";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import {
  useChatSidebarControls,
  useChatSidebarInfo,
} from "hooks/chats/chatSidebar";

import { PrivateChats, VenueChat } from "./components";

import "./ChatSidebar.scss";

export interface ChatSidebarProps {
  venue: WithId<AnyVenue>;
}

export const _ChatSidebar: React.FC<ChatSidebarProps> = ({ venue }) => {
  const {
    isExpanded,
    toggleSidebar,
    chatSettings,
    selectVenueChat,
    selectPrivateChat,
  } = useChatSidebarControls();

  const { privateChatTabTitle, venueChatTabTitle } = useChatSidebarInfo(venue);

  const isVenueChat = chatSettings.openedChatType === ChatTypes.VENUE_CHAT;
  const isPrivateChat = chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT;
  const recipientId =
    chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT
      ? chatSettings.recipientId
      : undefined;

  const containerStyles = classNames("chat-sidebar", {
    "chat-sidebar--expanded": isExpanded,
  });

  const venueChatTabStyles = classNames("chat-sidebar__tab", {
    "chat-sidebar__tab--selected": isVenueChat,
  });

  const privateChatTabStyles = classNames("chat-sidebar__tab", {
    "chat-sidebar__tab--selected": isPrivateChat,
  });

  const venueTabId = "chat-sidebar-tab-venue";
  const privateTabId = "chat-sidebar-tab-private";

  return (
    <div
      role="dialog"
      aria-labelledby={isVenueChat ? venueTabId : privateTabId}
      className={containerStyles}
    >
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

        {isExpanded && (
          <div className="chat-sidebar__tabs" role="tablist">
            <button
              role="tab"
              id={venueTabId}
              aria-label={venueChatTabTitle}
              aria-selected={isVenueChat}
              className={venueChatTabStyles}
              onClick={selectVenueChat}
            >
              {venueChatTabTitle}
            </button>
            <button
              role="tab"
              id={privateTabId}
              aria-label={privateChatTabTitle}
              aria-selected={isPrivateChat}
              className={privateChatTabStyles}
              onClick={selectPrivateChat}
            >
              {privateChatTabTitle}
            </button>
          </div>
        )}
      </div>
      {isExpanded && (
        <div role="tabpanel" className="chat-sidebar__tab-content">
          {isVenueChat && <VenueChat venue={venue} />}
          {isPrivateChat && (
            <PrivateChats recipientId={recipientId} venue={venue} />
          )}
        </div>
      )}
    </div>
  );
};

export const ChatSidebar = React.memo(_ChatSidebar, isEqual);
