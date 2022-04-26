import React from "react";
import classNames from "classnames";

import { ChatTypes } from "types/chat";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useNumberOfUnreadChats } from "hooks/chats/util/useChatSidebarInfo";

import { ChatSidebar } from "components/organisms/ChatSidebar";

import styles from "./ChatContainer.module.scss";

type ChatContainerProps = {
  isRelative?: boolean;
};

export const ChatContainer: React.FC<ChatContainerProps> = ({ isRelative }) => {
  const numberOfUnreadMessages = useNumberOfUnreadChats();
  const {
    selectPrivateChat,
    selectVenueChat,
    toggleSidebar,
    isExpanded,
    chatSettings: { openedChatType },
  } = useChatSidebarControls();

  const sidebarClasses = classNames(styles.chatSidebar, {
    [styles.sidebarHidden]: !isExpanded,
    [styles.relativeSideBar]: isRelative,
  });

  const containerlasses = classNames(styles.ChatContainer, {
    [styles.chatContainerExpanded]: isExpanded,
    [styles.relativeContainer]: isRelative,
  });

  const isSpaceChatOpen = isExpanded && openedChatType === ChatTypes.VENUE_CHAT;
  const isPrivateChatOpen =
    isExpanded && openedChatType === ChatTypes.PRIVATE_CHAT;

  return (
    <>
      <div className={sidebarClasses}>
        <ChatSidebar />
      </div>
      <div className={containerlasses}>
        <nav>
          <span
            className={classNames({
              [styles.selectedTab]: isSpaceChatOpen,
            })}
            onClick={isSpaceChatOpen ? toggleSidebar : selectVenueChat}
          >
            Chat
          </span>
          <span
            className={classNames({
              [styles.selectedTab]: isPrivateChatOpen,
            })}
            onClick={isPrivateChatOpen ? toggleSidebar : selectPrivateChat}
          >
            Messages
            {numberOfUnreadMessages > 0 && (
              <div className={styles.messageNotification} />
            )}
          </span>
          <span onClick={toggleSidebar} className={styles.toggler}>
            {isExpanded ? "Hide" : "Show"}
          </span>
        </nav>
      </div>
    </>
  );
};
