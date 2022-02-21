import styles from "./ChatContainer.module.scss";

export const ChatContainer: React.FC = () => (
  <div className={styles.ChatContainer}>
    <nav>
      <a href="#!">Chat</a>
      <a href="#!">
        Messages <span className="badge">3</span>
      </a>
      <a href="#!" id="component-chat-open-button">
        Show
      </a>
    </nav>
  </div>
);
