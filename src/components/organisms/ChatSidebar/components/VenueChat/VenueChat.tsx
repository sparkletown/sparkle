import React from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useVenueChat } from "hooks/useVenueChat";

import { Chatbox } from "components/molecules/Chatbox";

import "./VenueChat.scss";

export interface VenueChatProps {
  venue: WithId<AnyVenue>;
}

export const VenueChat: React.FC<VenueChatProps> = ({ venue }) => {
  const {
    sendMessage,
    deleteMessage,
    messagesToDisplay,
    sendThreadReply,
  } = useVenueChat(venue.id);

  return (
    <div className="venue-chat">
      <Chatbox
        // poll is available for Venue Chat only (displayPoll = true)
        displayPoll
        messages={messagesToDisplay}
        sendMessage={sendMessage}
        sendThreadReply={sendThreadReply}
        deleteMessage={deleteMessage}
        venue={venue}
      />
    </div>
  );
};
