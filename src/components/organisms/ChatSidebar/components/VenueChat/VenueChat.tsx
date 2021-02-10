import React from "react";

import { Chatbox } from "./components/Chatbox";

import { useVenueChat } from "hooks/useVenueChat";

import "./VenueChat.scss";

export const VenueChat: React.FC = () => {
  const { sendMessage, deleteMessage, displayMessages } = useVenueChat();

  return (
    <div className="venue-chat-container">
      <Chatbox
        messages={displayMessages}
        sendMessage={sendMessage}
        deleteMessage={deleteMessage}
      />
    </div>
  );
};
