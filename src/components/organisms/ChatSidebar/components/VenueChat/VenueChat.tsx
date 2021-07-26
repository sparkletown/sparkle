import React from "react";
import { isEqual } from "lodash";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useVenueChat } from "hooks/chats/venueChat";

import { Chatbox } from "components/molecules/Chatbox";

import "./VenueChat.scss";

export interface VenueChatProps {
  venue: WithId<AnyVenue>;
}

export const _VenueChat: React.FC<VenueChatProps> = ({ venue }) => {
  const {
    sendMessage,
    deleteMessage,
    messages,
    sendThreadReply,
  } = useVenueChat(venue.id);

  return (
    <div className="venue-chat">
      {messages.length > 0 && (
        <Chatbox
          // poll is available for Venue Chat only (displayPoll = true)
          displayPoll
          messages={messages}
          sendMessage={sendMessage}
          sendThreadReply={sendThreadReply}
          deleteMessage={deleteMessage}
          venue={venue}
        />
      )}
    </div>
  );
};

export const VenueChat = React.memo(_VenueChat, isEqual);
