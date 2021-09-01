import React, { useCallback, useState } from "react";
import {
  faCommentDots,
  faEnvelope,
  faPen,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { isEqual } from "lodash";

import { ChatTypes } from "types/chat";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { openUrlInNewTab } from "utils/url";

import {
  useChatSidebarControls,
  useChatSidebarInfo,
} from "hooks/chats/chatSidebar";

import { ChatSidebarButton } from "components/organisms/ChatSidebar/components/ChatSidebarButton";
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
    newPrivateMessageReceived,
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

  const goToAdmin = useCallback(() => {
    openUrlInNewTab(`${window.location.origin}/admin`);
  }, []);

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
      <div className="chat-sidebar__header-buttons">
        <ChatSidebarButton
          text="Chat"
          tooltipText="Opens pool chat"
          ariaLabel={isExpanded ? "Hide chat" : "Show chat"}
          icon={faCommentDots}
          onClick={handleSidebar}
          isChatSidebarExpanded={isExpanded}
        />

        {!isExpanded && (
          <ChatSidebarButton
            text="Messages"
            tooltipText="Opens direct messages"
            ariaLabel={isExpanded ? "Hide chat" : "Show chat"}
            icon={faEnvelope}
            onClick={togglePrivateChatSidebar}
            newMessage={newPrivateMessageReceived > 0}
          />
        )}

        {!isShownHelpCenter && !isExpanded && (
          <ChatSidebarButton
            text="Help!"
            tooltipText="Opens help centre"
            ariaLabel={isExpanded ? "Hide help centre" : "Show help centre"}
            icon={faQuestion}
            onClick={openHelpCenter}
          />
        )}

        {!isShownHelpCenter && !isExpanded && (
          <ChatSidebarButton
            text="Create"
            tooltipText="Opens creation tools"
            ariaLabel="Create space"
            icon={faPen}
            onClick={goToAdmin}
          />
        )}
      </div>

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
