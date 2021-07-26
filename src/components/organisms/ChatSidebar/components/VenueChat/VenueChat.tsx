import React, { useState } from "react";
import { isEqual } from "lodash";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useVenueChat } from "hooks/chats/venueChat";

import { Chatbox } from "components/molecules/Chatbox";

import "./VenueChat.scss";

export interface VenueChatProps {
  venue: WithId<AnyVenue>;
}

const MESSAGES_BATCH_LOAD_SIZE = 50;

export const _VenueChat: React.FC<VenueChatProps> = ({ venue }) => {
  const [messagesLimit, setMessagesLimit] = useState(MESSAGES_BATCH_LOAD_SIZE);

  const {
    sendMessage,
    deleteMessage,
    messagesToDisplay,
    hasMoreMessages,
    sendThreadReply,
  } = useVenueChat(venue.id, messagesLimit);

  const loadMoreMessages = () =>
    setMessagesLimit(messagesLimit + MESSAGES_BATCH_LOAD_SIZE);

  return (
    <div className="venue-chat">
      {messagesToDisplay.length > 0 && (
        <Chatbox
          // poll is available for Venue Chat only (displayPoll = true)
          displayPoll
          messages={messagesToDisplay}
          loadMoreMessages={loadMoreMessages}
          hasMoreMessages={hasMoreMessages}
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
