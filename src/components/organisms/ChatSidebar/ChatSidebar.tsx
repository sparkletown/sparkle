import React from "react";
import { isEqual } from "lodash";

import { ChatTypes } from "types/chat";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";

import { PrivateChats, VenueChat } from "./components";

import styles from "./ChatSidebar.module.scss";

export const _ChatSidebar: React.FC = () => {
  const { chatSettings } = useChatSidebarControls();

  const isVenueChat = chatSettings.openedChatType === ChatTypes.VENUE_CHAT;
  const isPrivateChat = chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT;
  const recipient =
    chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT
      ? chatSettings.recipient
      : undefined;

  const venueTabId = "chat-sidebar-tab-venue";
  const privateTabId = "chat-sidebar-tab-private";

  return (
    <div
      role="dialog"
      aria-labelledby={isVenueChat ? venueTabId : privateTabId}
      className={styles.chatSidebar}
    >
      {isVenueChat && <VenueChat />}
      {isPrivateChat && <PrivateChats recipient={recipient} />}
    </div>
  );
};

export const ChatSidebar = React.memo(_ChatSidebar, isEqual);
