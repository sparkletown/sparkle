import React, { useEffect } from "react";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";
import { useRecipientChat } from "hooks/chats/privateChats/useRecipientChat";

import { Chatbox } from "components/molecules/Chatbox";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./RecipientChat.scss";
export interface RecipientChatProps {
  recipient: WithId<DisplayUser>;
}

export const RecipientChat: React.FC<RecipientChatProps> = ({ recipient }) => {
  const {
    messagesToDisplay,

    sendMessageToSelectedRecipient,
    markMessageRead,
    sendThreadReply,
  } = useRecipientChat(recipient);

  useEffect(() => {
    const unreadCounterpartyMessages = messagesToDisplay.filter(
      (message) => !message.isRead && message.fromUser.id === recipient.id
    );

    if (unreadCounterpartyMessages.length > 0) {
      unreadCounterpartyMessages.forEach((message) =>
        markMessageRead(message.id)
      );
    }
  }, [messagesToDisplay, recipient.id, markMessageRead]);

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
