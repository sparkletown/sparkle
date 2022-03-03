import { ChatTypes } from "types/chat";

import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";

import { ChatSidebar } from "components/organisms/ChatSidebar";

import styles from "./ChatContainer.module.scss";

export const ChatContainer: React.FC = () => {
  // TODO Fix this - it should call useNumberOfUnreadChats
  // However, that is currently broken due to a query timing issue
  const numberOfUnreadMessages = 0; // useNumberOfUnreadChats();
  const {
    selectPrivateChat,
    selectVenueChat,
    toggleSidebar,
    isExpanded,
    chatSettings: { openedChatType },
  } = useChatSidebarControls();

  return (
    <>
      {isExpanded && (
        <div className={styles.chatSidebar}>
          <ChatSidebar />
        </div>
      )}
      <div className={styles.ChatContainer}>
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
