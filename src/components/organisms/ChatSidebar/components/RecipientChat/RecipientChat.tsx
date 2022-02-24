import React, { useEffect } from "react";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

import { useRecipientChatMessages } from "hooks/chats/private/useRecipientChat";
import { useRecipientChatActions } from "hooks/chats/private/useRecipientChatActions";
import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useRenderInfiniteScroll } from "hooks/chats/util/useRenderInfiniteScroll";

import { Chatbox } from "components/molecules/Chatbox";
import { ChatboxContextProvider } from "components/molecules/Chatbox/components/context/ChatboxContext";

import { UserAvatar } from "components/atoms/UserAvatar";

import styles from "./RecipientChat.module.scss";

export interface RecipientChatProps {
  recipient: WithId<DisplayUser>;
}

export const RecipientChat: React.FC<RecipientChatProps> = ({ recipient }) => {
  const {
    messagesToDisplay: allMessagesToDisplay,
    replies,
  } = useRecipientChatMessages(recipient);

  const actions = useRecipientChatActions(recipient);

  useEffect(() => {
    const unreadCounterpartyMessages = allMessagesToDisplay.filter(
      (message) => !message.isRead && message.fromUser.id === recipient.id
    );

    if (unreadCounterpartyMessages.length > 0) {
      unreadCounterpartyMessages.forEach((message) =>
        actions.markMessageRead(message.id)
      );
    }
  }, [allMessagesToDisplay, recipient.id, actions]);

  const { selectPrivateChat } = useChatSidebarControls();

  const [messagesToDisplay, infiniteProps] = useRenderInfiniteScroll(
    allMessagesToDisplay
  );

  return (
    <div className={styles.recipientChat}>
      <div onClick={selectPrivateChat} className={styles.infoContainer}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          className={styles.backIcon}
          size="sm"
        />
        <UserAvatar size="medium" user={recipient} />
        <div className="recipient-chat__nickname">{recipient.partyName}</div>
      </div>
      <ChatboxContextProvider preloadedThreads={replies} {...actions}>
        <Chatbox
          containerClassName="recipient-chat__chatbox"
          messages={messagesToDisplay}
          {...infiniteProps}
        />
      </ChatboxContextProvider>
    </div>
  );
};
