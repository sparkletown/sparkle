import React, { useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { Chatbox } from "components/molecules/Chatbox_NEW";
import { UserAvatar } from "components/atoms/UserAvatar";

import { useRecipientChat } from "hooks/usePrivateChats";
import { useChatsSidebarControls } from "hooks/useChatsSidebar";

import { OnAvatarClick } from "types/User";

import "./RecipientChat.scss";

export interface RecipientChatProps {
  recipientId: string;
  onAvatarClick: OnAvatarClick;
}

export const RecipientChat: React.FC<RecipientChatProps> = ({
  recipientId,
  onAvatarClick,
}) => {
  const {
    messagesToDisplay,
    sendMessageToSelectedRecipient,
    deleteMessage,
    markMessageRead,
    recipient,
  } = useRecipientChat(recipientId);

  const handleAvatarClick = useCallback(
    () => onAvatarClick({ ...recipient, id: recipientId }),
    [onAvatarClick, recipient, recipientId]
  );

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

  const { openPrivateChats } = useChatsSidebarControls();

  return (
    <div className="recipient-chat-container">
      <div className="recipient-chat-back-container">
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="recipient-chat-back-icon"
          size="sm"
          onClick={openPrivateChats}
        />

        <UserAvatar
          avatarSrc={recipient.pictureUrl}
          onClick={handleAvatarClick}
        />
        <div
          className="recipient-chat-back-nickname"
          onClick={handleAvatarClick}
        >
          {recipient.partyName}
        </div>
      </div>
      <Chatbox
        messages={messagesToDisplay}
        sendMessage={sendMessageToSelectedRecipient}
        deleteMessage={deleteMessage}
        onAvatarClick={onAvatarClick}
      />
    </div>
  );
};
