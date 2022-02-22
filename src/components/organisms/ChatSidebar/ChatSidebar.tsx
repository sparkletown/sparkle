import React from "react";
import {
  faChevronLeft,
  faChevronRight,
  faCommentDots,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { isEqual } from "lodash";

import { ChatTypes } from "types/chat";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useChatSidebarInfo } from "hooks/chats/util/useChatSidebarInfo";

import { PrivateChats, VenueChat } from "./components";

export const _ChatSidebar: React.FC = () => {
  const {
    isExpanded,
    toggleSidebar,
    togglePrivateChatSidebar,
    newPrivateMessageRecived,
    chatSettings,
    selectVenueChat,
    selectPrivateChat,
  } = useChatSidebarControls();

  const { privateChatTabTitle } = useChatSidebarInfo();

  const isVenueChat = chatSettings.openedChatType === ChatTypes.VENUE_CHAT;
  const isPrivateChat = chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT;
  const recipient =
    chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT
      ? chatSettings.recipient
      : undefined;

  const containerStyles = classNames("chat-sidebar", {
    "chat-sidebar--expanded": isExpanded,
    "chat-sidebar--collapsed": !isExpanded,
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
      {isExpanded ? (
        <>
          <div className="chat-sidebar__header">
            <button
              aria-label="Hide chat"
              className="chat-sidebar__controller"
              onClick={toggleSidebar}
            >
              <FontAwesomeIcon icon={faChevronRight} size="sm" />
            </button>
            <div className="chat-sidebar__tabs" role="tablist">
              <button
                role="tab"
                id={venueTabId}
                aria-label="Chat"
                aria-selected={isVenueChat}
                className={venueChatTabStyles}
                onClick={selectVenueChat}
              >
                Chat
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
          </div>
          <div role="tabpanel" className="chat-sidebar__tab-content">
            {isVenueChat && <VenueChat />}
            {isPrivateChat && <PrivateChats recipient={recipient} />}
          </div>
        </>
      ) : (
        <div className="chat-sidebar__header">
          <button
            aria-label="Show chat"
            className="chat-sidebar__controller"
            onClick={toggleSidebar}
          >
            <>
              <FontAwesomeIcon icon={faChevronLeft} size="sm" />
              <div className="chat-sidebar__controller-wrapper">
                <FontAwesomeIcon icon={faCommentDots} size="lg" />
                <span className="chat-sidebar__controller-text">Chat</span>
              </div>
            </>
          </button>
          <button
            aria-label="Show chat"
            className="chat-sidebar__controller chat-sidebar__private-chat"
            onClick={togglePrivateChatSidebar}
          >
            <>
              <FontAwesomeIcon icon={faChevronLeft} size="sm" />
              <div className="chat-sidebar__controller-wrapper">
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
                <span className="chat-sidebar__controller-text">Messages</span>
                {newPrivateMessageRecived > 0 && (
                  <div className="chat-sidebar__controller--new-message"></div>
                )}
              </div>
            </>
          </button>
        </div>
      )}
    </div>
  );
};

export const ChatSidebar = React.memo(_ChatSidebar, isEqual);
