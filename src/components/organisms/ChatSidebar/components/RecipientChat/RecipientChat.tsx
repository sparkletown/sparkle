import React, { useEffect, useMemo, useState } from "react";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { BaseChatMessage, MessageToDisplay } from "types/chat";
import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

import { useRecipientChat } from "hooks/chats/private/useRecipientChat";
import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useRenderInfiniteScroll } from "hooks/chats/util/useRenderInfiniteScroll";

import { Chatbox } from "components/molecules/Chatbox";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./RecipientChat.scss";

export interface RecipientChatProps {
  recipient: WithId<DisplayUser>;
}

export const RecipientChat: React.FC<RecipientChatProps> = ({ recipient }) => {
  const {
    messagesToDisplay: allMessagesToDisplay,
    replies,

    sendMessage,
    markMessageRead,
    sendThreadMessage,
  } = useRecipientChat(recipient);

  useEffect(() => {
    const unreadCounterpartyMessages = allMessagesToDisplay.filter(
      (message) => !message.isRead && message.fromUser.id === recipient.id
    );

    if (unreadCounterpartyMessages.length > 0) {
      unreadCounterpartyMessages.forEach((message) =>
        markMessageRead(message.id)
      );
    }
  }, [allMessagesToDisplay, recipient.id, markMessageRead]);

  const { selectPrivateChat } = useChatSidebarControls();

  const [messagesToDisplay, infiniteProps] = useRenderInfiniteScroll(
    allMessagesToDisplay
  );

  const [thread, setThread] = useState<WithId<MessageToDisplay>>();

  const threadMessages: WithId<BaseChatMessage>[] = useMemo(() => {
    const threadId = thread?.id;
    if (threadId) return replies[threadId] ?? ALWAYS_EMPTY_ARRAY;
    return ALWAYS_EMPTY_ARRAY;
  }, [replies, thread?.id]);

  return (
    <div className="recipient-chat">
      <div className="recipient-chat__breadcrumbs" onClick={selectPrivateChat}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="recipient-chat__back-icon"
          size="sm"
        />
        <UserAvatar user={recipient} showStatus size="small" />
        <div className="recipient-chat__nickname">{recipient.partyName}</div>
      </div>
      <Chatbox
        containerClassName="recipient-chat__chatbox"
        messages={messagesToDisplay}
        threadMessages={threadMessages}
        selectedThread={thread}
        setSelectedThread={setThread}
        sendMessage={sendMessage}
        sendThreadMessage={sendThreadMessage}
        {...infiniteProps}
      />
    </div>
  );
};
