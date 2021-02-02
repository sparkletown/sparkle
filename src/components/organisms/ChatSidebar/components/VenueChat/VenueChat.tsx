import React from "react";

import { Chatbox } from "./components/Chatbox";

import { useVenueChat } from "hooks/useVenueChat";

import "./VenueChat.scss";

export const VenueChat: React.FC = () => {
  const { venueChatMessages } = useVenueChat();

  const sendMessage = () => {};
  const deleteMessage = () => {};

  return (
    <div className="venue-chat-container">
      <Chatbox
        messages={venueChatMessages}
        sendMessage={sendMessage}
        deleteMessage={deleteMessage}
      />
    </div>
  );
};
