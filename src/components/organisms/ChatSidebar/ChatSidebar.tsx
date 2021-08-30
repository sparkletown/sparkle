import React, { useCallback, useState } from "react";
import {
  faChevronLeft,
  faChevronRight,
  faCommentDots,
  faEnvelope,
  faQuestion,
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

import { HelpCenter } from "components/organisms/HelpCenter";

import { ButtonNG } from "components/atoms/ButtonNG";

import { PrivateChats, VenueChat } from "./components";

import "./ChatSidebar.scss";

export interface ChatSidebarProps {
  venue: WithId<AnyVenue>;
}

export const _ChatSidebar: React.FC<ChatSidebarProps> = ({ venue }) => {
  const {
    isExpanded,
    newPrivateMessageRecived,
    toggleSidebar,
    togglePrivateChatSidebar,
    chatSettings,
    selectVenueChat,
    selectPrivateChat,
  } = useChatSidebarControls();

  const { privateChatTabTitle, venueChatTabTitle } = useChatSidebarInfo(venue);

  const [isShownHelpCenter, setShownHelpCenter] = useState<boolean>(false);

  const isVenueChat = chatSettings.openedChatType === ChatTypes.VENUE_CHAT;
  const isPrivateChat = chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT;
  const recipientId =
    chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT
      ? chatSettings.recipientId
      : undefined;

  const openHelpCenter = useCallback(() => {
    setShownHelpCenter(true);
    toggleSidebar();
  }, [toggleSidebar]);

  const handleSidebar = useCallback(() => {
    toggleSidebar();
    if (isShownHelpCenter) {
      setShownHelpCenter(false);
    }
  }, [isShownHelpCenter, toggleSidebar]);

  const containerStyles = classNames({
    "chat-sidebar": true,
    "chat-sidebar--expanded": isExpanded,
    "chat-sidebar--collapsed": !isExpanded,
    "chat-sidebar--wide": isShownHelpCenter,
  });

  const venueChatTabStyles = classNames({
    "chat-sidebar__tab": true,
    "chat-sidebar__tab--selected": isVenueChat,
  });

  const privateChatTabStyles = classNames({
    "chat-sidebar__tab": true,
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
          onClick={handleSidebar}
        >
          {isExpanded ? (
            <FontAwesomeIcon icon={faChevronRight} size="sm" />
          ) : (
            <>
              <FontAwesomeIcon icon={faChevronLeft} size="sm" />
              <FontAwesomeIcon icon={faCommentDots} size="lg" />
            </>
          )}
        </button>

        {!isExpanded && (
          <button
            aria-label={isExpanded ? "Hide chat" : "Show chat"}
            className="chat-sidebar__controller chat-sidebar__private-chat"
            onClick={togglePrivateChatSidebar}
          >
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
            {newPrivateMessageRecived > 0 && (
              <div className="chat-sidebar__controller--new-message"></div>
            )}
          </button>
        )}

        {!isShownHelpCenter && !isExpanded && (
          <button
            aria-label={
              isExpanded ? "Hide question centre" : "Show question centre"
            }
            className="chat-sidebar__controller chat-sidebar__help-center-icon"
            onClick={openHelpCenter}
          >
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
            <FontAwesomeIcon icon={faQuestion} size="lg" />
          </button>
        )}

        {isExpanded && (
          <>
            {!isShownHelpCenter && (
              <div className="chat-sidebar__tabs" role="tablist">
                <ButtonNG
                  className={venueChatTabStyles}
                  onClick={selectVenueChat}
                  aria-label={venueChatTabTitle}
                  aria-selected={isVenueChat}
                  role="tab"
                  iconName={faCommentDots}
                >
                  {venueChatTabTitle}
                </ButtonNG>
                <ButtonNG
                  role="tab"
                  aria-label={privateChatTabTitle}
                  aria-selected={isPrivateChat}
                  className={privateChatTabStyles}
                  onClick={selectPrivateChat}
                  iconName={faEnvelope}
                >
                  {privateChatTabTitle}
                </ButtonNG>
              </div>
            )}
          </>
        )}
      </div>
      {isExpanded && (
        <div role="tabpanel" className="chat-sidebar__tab-content">
          {!isShownHelpCenter && isVenueChat && <VenueChat venue={venue} />}
          {!isShownHelpCenter && isPrivateChat && (
            <PrivateChats recipientId={recipientId} />
          )}
          {isShownHelpCenter && <HelpCenter />}
        </div>
      )}
    </div>
  );
};

export const ChatSidebar = React.memo(_ChatSidebar, isEqual);
