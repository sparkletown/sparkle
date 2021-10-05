import React from "react";
import { isEqual } from "lodash";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useVenueChatActions } from "hooks/chats/venue/useVenueChat";
import { useCanDeleteVenueChatMessages } from "hooks/useCanDeleteVenueChatMessages";

import { Chatbox } from "components/molecules/Chatbox";

import "./VenueChat.scss";

export interface VenueChatProps {
  venue: WithId<AnyVenue>;
}

export const _VenueChat: React.FC<VenueChatProps> = ({ venue }) => {
  const { sendMessage, deleteMessage, sendThreadReply } = useVenueChatActions(
    venue.id
  );

  const canDeleteMessages = useCanDeleteVenueChatMessages(venue);

  return (
    <Chatbox
      // poll is available for Venue Chat only (displayPoll = true)
      displayPoll
      messages={[]}
      sendMessage={sendMessage}
      sendThreadReply={sendThreadReply}
      deleteMessage={canDeleteMessages ? deleteMessage : undefined}
      containerClassName="venue-chat"
      allMessagesCount={0}
      loadMore={() => {}}
    />
  );
};

export const VenueChat = React.memo(_VenueChat, isEqual);
