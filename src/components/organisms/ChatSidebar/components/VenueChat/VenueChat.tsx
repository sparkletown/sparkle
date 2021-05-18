import React from "react";

import { Chatbox } from "components/molecules/Chatbox";

import { useVenueChat } from "hooks/useVenueChat";

import "./VenueChat.scss";

export const VenueChat: React.FC = () => {
  const {
    sendMessage,
    deleteMessage,
    messagesToDisplay,
    sendThreadReply,
  } = useVenueChat();

  return (
    <div className="venue-chat">
      <Chatbox
        // poll is available for Venue Chat only (displayPoll = true)
        displayPoll
        messages={messagesToDisplay}
        sendMessage={sendMessage}
        sendThreadReply={sendThreadReply}
        deleteMessage={deleteMessage}
      />
    </div>
  );
};
