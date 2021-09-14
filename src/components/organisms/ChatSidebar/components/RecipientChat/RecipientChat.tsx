import React, { useEffect } from "react";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";
import { useRecipientChat } from "hooks/chats/privateChats/useRecipientChat";

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
        sendMessage={sendMessageToSelectedRecipient}
        sendThreadReply={sendThreadReply}
      />
    </div>
  );
};
