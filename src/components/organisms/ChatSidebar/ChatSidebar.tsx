import React from "react";
import { isEqual } from "lodash";

import { CHAT_TAB_PRIVATE_ID, CHAT_TAB_SPACE_ID } from "settings";

import { ChatTypes } from "types/chat";

import { captureError, SparkleAssertError } from "utils/error";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useUserId } from "hooks/user/useUserId";

import { PrivateChats, VenueChat } from "./components";

import styles from "./ChatSidebar.module.scss";

const _ChatSidebar: React.FC = () => {
  const { chatSettings } = useChatSidebarControls();
  const { userId, isLoading } = useUserId();

  const isVenueChat = chatSettings.openedChatType === ChatTypes.VENUE_CHAT;
  const isPrivateChat = chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT;
  const recipient =
    chatSettings.openedChatType === ChatTypes.PRIVATE_CHAT
      ? chatSettings.recipient
      : undefined;

  if (isLoading) {
    // No need to show anything in this case
    // loading should be quick and from cache
    return null;
  } else if (!userId) {
    // But in this case, chat has been used in a in a place with no user logged in
    captureError(
      new SparkleAssertError({
        message:
          "ChatSidebar, as a descendant of LoginRestricted, should have userId",
        where: "ChatSidebar",
        args: { isLoading, userId, chatSettings },
      })
    );
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby={isVenueChat ? CHAT_TAB_SPACE_ID : CHAT_TAB_PRIVATE_ID}
      className={styles.chatSidebar}
    >
      {isVenueChat && <VenueChat />}
      {isPrivateChat && userId && (
        <PrivateChats userId={userId} recipient={recipient} />
      )}
    </div>
  );
};

export const ChatSidebar = React.memo(_ChatSidebar, isEqual);
