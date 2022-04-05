import classNames from "classnames";

import { ChatTypes } from "types/chat";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useNumberOfUnreadChats } from "hooks/chats/util/useChatSidebarInfo";

import { ChatSidebar } from "components/organisms/ChatSidebar";

import styles from "./ChatContainer.module.scss";

export const ChatContainer: React.FC = () => {
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
  });

  const containerlasses = classNames(styles.ChatContainer, {
    [styles.chatContainerExpanded]: isExpanded,
  });

  return (
    <>
      <div className={sidebarClasses}>
        <ChatSidebar />
      </div>
      <div className={containerlasses}>
        <nav>
          <span
            onClick={
              isExpanded && openedChatType === ChatTypes.VENUE_CHAT
                ? toggleSidebar
                : selectVenueChat
            }
          >
            Chat
          </span>
          <span
            onClick={
              isExpanded && openedChatType === ChatTypes.PRIVATE_CHAT
                ? toggleSidebar
                : selectPrivateChat
            }
          >
            Messages
            {numberOfUnreadMessages > 0 && (
              <div className={styles.messageNotification}></div>
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
