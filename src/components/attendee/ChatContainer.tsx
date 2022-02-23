import styles from "./ChatContainer.module.scss";

export const ChatContainer: React.FC = () => (
  <div className={styles.ChatContainer}>
    <nav>
      <a href="#!">Chat</a>
      <a href="#!">
        Messages <span className="badge">3</span>
      </a>
      <div className="radio">
        <a id="component-chat-radio-toggle" href="#!" className="muted">
          Radio <span className="icon"> </span>
        </a>
        <span className="live-info">
          <span>Lil Ugly Mane - On Doing an Evil Deed Blues</span>
        </span>
      </div>
      <a href="#!" id="component-chat-open-button">
        Show
      </a>
    </nav>
  </div>
);
