import React from "react";
import { isEqual } from "lodash";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useVenueChat } from "hooks/chats/venueChat";
import { useCanDeleteVenueChatMessages } from "hooks/useCanDeleteVenueChatMessages";

import { Chatbox } from "components/molecules/Chatbox";

import "./VenueChat.scss";

export interface VenueChatProps {
  venue: WithId<AnyVenue>;
}

export const _VenueChat: React.FC<VenueChatProps> = ({ venue }) => {
  const {
    sendMessage,
    deleteMessage,
    messagesToDisplay,
    sendThreadReply,
  } = useVenueChat(venue.id);

  const canDeleteMessages = useCanDeleteVenueChatMessages(venue);

  return (
    <div className="venue-chat">
      <Chatbox
        // poll is available for Venue Chat only (displayPoll = true)
        displayPoll
        messages={messagesToDisplay}
        sendMessage={sendMessage}
        sendThreadReply={sendThreadReply}
        deleteMessage={canDeleteMessages ? deleteMessage : undefined}
      />
    </div>
  );
};

export const VenueChat = React.memo(_VenueChat, isEqual);
