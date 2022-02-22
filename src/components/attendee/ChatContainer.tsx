import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useNumberOfUnreadChats } from "hooks/chats/util/useChatSidebarInfo";

import { ChatSidebar } from "components/organisms/ChatSidebar";

import styles from "./ChatContainer.module.scss";

export const ChatContainer: React.FC = () => {
  const numberOfUnreadMessages = useNumberOfUnreadChats();
  const { toggleSidebar, isExpanded } = useChatSidebarControls();

  return (
    <>
      {isExpanded && (
        <div className={styles.chatSidebar}>
          <ChatSidebar />
        </div>
      )}
      <div className={styles.ChatContainer}>
        <nav>
          <span>Chat</span>
          <span>
            Messages{" "}
            {numberOfUnreadMessages > 0 && (
              <span className={styles.messageCount}>
                {numberOfUnreadMessages}
              </span>
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
