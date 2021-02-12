import React from "react";

import { Chatbox } from "components/molecules/Chatbox";

import { useRecipientChat } from "hooks/usePrivateChats";

export interface RecipientChatProps {
  recipientId: string;
}

export const RecipientChat: React.FC<RecipientChatProps> = ({
  recipientId,
}) => {
  const {
    messages,
    sendMessageToSelectedRecipient,
    deleteMessage,
  } = useRecipientChat(recipientId);

  return (
    <div className="recipient-chat-container">
      <div>Go back button</div>
      <Chatbox
        messages={messages}
        sendMessage={sendMessageToSelectedRecipient}
        deleteMessage={deleteMessage}
      />
    </div>
  );
};
