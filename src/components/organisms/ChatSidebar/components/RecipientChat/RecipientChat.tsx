import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { Chatbox } from "components/molecules/Chatbox";
import { UserAvatar } from "components/atoms/UserAvatar";

import { useRecipientChat } from "hooks/privateChats";
import { useChatSidebarControls } from "hooks/chatSidebar";

import "./RecipientChat.scss";

export interface RecipientChatProps {
  recipientId: string;
}

export const RecipientChat: React.FC<RecipientChatProps> = ({
  recipientId,
}) => {
  const {
    messagesToDisplay,
    sendMessageToSelectedRecipient,
    deleteMessage,
    markMessageRead,
    recipient,
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

  return (
    <div className="recipient-chat">
      <div className="recipient-chat__breadcrumbs" onClick={selectPrivateChat}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="recipient-chat__back-icon"
          size="sm"
        />
        <UserAvatar user={recipient} />
        <div className="recipient-chat__nickname">{recipient.partyName}</div>
      </div>
      <Chatbox
        messages={messagesToDisplay}
        sendMessage={sendMessageToSelectedRecipient}
        deleteMessage={deleteMessage}
      />
    </div>
  );
};
