import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useNumberOfUnreadChats } from "hooks/chats/util/useChatSidebarInfo";

import styles from "./ChatContainer.module.scss";

export const ChatContainer: React.FC = () => {
  const numberOfUnreadMessages = useNumberOfUnreadChats();
  const { toggleSidebar, isExpanded } = useChatSidebarControls();

  return (
    <>
      {isExpanded && <div className={styles.chatSidebar}></div>}
      <div className={styles.ChatContainer}>
        <nav>
          <a href="#!">Chat</a>
          <a href="#!">
            Messages{" "}
            {numberOfUnreadMessages > 0 && (
              <span className={styles.messageCount}>
                {numberOfUnreadMessages}
              </span>
            )}
          </a>
          <a href="#!" onClick={toggleSidebar} className={styles.toggler}>
            Show
          </a>
        </nav>
      </div>
    </>
  );
};
