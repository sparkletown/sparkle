import React from "react";

import { Chatbox } from "components/molecules/Chatbox";

import { useVenueChat } from "hooks/useVenueChat";

import "./VenueChat.scss";

export const VenueChat: React.FC = () => {
  const { sendMessage, deleteMessage, messagesToDisplay } = useVenueChat();

  return (
    <div className="venue-chat">
      <Chatbox
        messages={messagesToDisplay}
        sendMessage={sendMessage}
        deleteMessage={deleteMessage}
      />
    </div>
  );
};
