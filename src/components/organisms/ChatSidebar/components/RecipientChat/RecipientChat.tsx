import { useUser } from "hooks/useUser";
import { useCallback } from "react";
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { MessageToDisplay } from "types/chat";

import { Chatbox } from "components/molecules/Chatbox";
import { UserAvatar } from "components/atoms/UserAvatar";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";

import "./RecipientChat.scss";
import { useRecipientChat } from "hooks/chats/privateChats/useRecipientChat";
export interface RecipientChatProps {
  recipientId: string;
}

export const RecipientChat: React.FC<RecipientChatProps> = ({
  recipientId,
}) => {
  const {
    messagesToDisplay,
    recipient,

    sendMessageToSelectedRecipient,
    deleteMessage,
    markMessageRead,
    sendThreadReply,
  } = useRecipientChat(recipientId);

  useEffect(() => {
    const unreadCounterpartyMessages = messagesToDisplay.filter(
      (message) => !message.isRead && message.from === recipientId
    );

    if (unreadCounterpartyMessages.length > 0) {
      unreadCounterpartyMessages.forEach((message) =>
        markMessageRead(message.id)
      );
    }
  }, [messagesToDisplay, recipientId, markMessageRead]);

  const { selectPrivateChat } = useChatSidebarControls();

  const { userWithId } = useUser();

  const canDeleteMessage = useCallback(
    (msg: MessageToDisplay) => msg.from === userWithId?.id,
    [userWithId?.id]
  );

  return (
    <div className="recipient-chat">
      <div className="recipient-chat__breadcrumbs" onClick={selectPrivateChat}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="recipient-chat__back-icon"
          size="sm"
        />
        <UserAvatar user={recipient} showStatus />
        <div className="recipient-chat__nickname">{recipient.partyName}</div>
      </div>
      <div className="recipient-chat__chatbox">
        <Chatbox
          messages={messagesToDisplay}
          sendMessage={sendMessageToSelectedRecipient}
          deleteMessage={deleteMessage}
          canDeleteMessage={canDeleteMessage}
          sendThreadReply={sendThreadReply}
        />
      </div>
    </div>
  );
};
