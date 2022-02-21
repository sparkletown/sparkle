import styles from "./ChatContainer.module.scss";

export const ChatContainer: React.FC = () => (
  <div className={styles.ChatContainer}>
    <nav>
      <a href="#!">Chat</a>
      <a href="#!">
        Messages <span className={styles.messageCount}>3,021</span>
      </a>
      <a href="#!" className={styles.toggler}>
        Show
      </a>
    </nav>
  </div>
);
