import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { Chatbox } from "components/molecules/Chatbox";
import { UserAvatar } from "components/atoms/UserAvatar";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";

import "./RecipientChat.scss";
import { useRecipientChat } from "hooks/chats/privateChats/useRecipientChat";
export interface RecipientChatProps {
  recipientId: string;
  venue: WithId<AnyVenue>;
}

export const RecipientChat: React.FC<RecipientChatProps> = ({
  recipientId,
  venue,
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

  return (
    <div className="recipient-chat">
      <div className="recipient-chat__breadcrumbs" onClick={selectPrivateChat}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          className="recipient-chat__back-icon"
          size="sm"
        />
        <UserAvatar viewingUser={recipient} showStatus />
        <div className="recipient-chat__nickname">{recipient.partyName}</div>
      </div>
      <div className="recipient-chat__chatbox">
        <Chatbox
          messages={messagesToDisplay}
          sendMessage={sendMessageToSelectedRecipient}
          deleteMessage={deleteMessage}
          sendThreadReply={sendThreadReply}
          venue={venue}
        />
      </div>
    </div>
  );
};
