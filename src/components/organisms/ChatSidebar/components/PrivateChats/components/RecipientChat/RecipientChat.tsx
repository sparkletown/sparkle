import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { Chatbox } from "components/molecules/Chatbox";
import { UserAvatar } from "components/atoms/UserAvatar";

import { useRecipientChat } from "hooks/usePrivateChats";

import "./RecipientChat.scss";
import { useChatsSidebarControls } from "hooks/useChatsSidebar";

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
    recipient,
  } = useRecipientChat(recipientId);

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

        <UserAvatar avatarSrc={recipient.pictureUrl} />
        <div className="recipient-chat-back-nickname">
          {recipient.partyName}
        </div>
      </div>
      <Chatbox
        messages={messagesToDisplay}
        sendMessage={sendMessageToSelectedRecipient}
        deleteMessage={deleteMessage}
      />
    </div>
  );
};
