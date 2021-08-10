import React, { useCallback, useEffect } from "react";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { MessageToDisplay } from "types/chat";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";
import { useRecipientChat } from "hooks/chats/privateChats/useRecipientChat";
import { useUser } from "hooks/useUser";

import { Chatbox } from "components/molecules/Chatbox";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./RecipientChat.scss";
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
