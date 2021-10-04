import React from "react";
import { isEqual } from "lodash";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useRenderInfiniteScrollChatMessages } from "hooks/chats/util/useRenderInfiniteScrollChatMessages";
import { useVenueChat } from "hooks/chats/venue/useVenueChat";
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
    messagesToDisplay: allMessagesToDisplay,
    sendThreadReply,
  } = useVenueChat(venue.id);

  const canDeleteMessages = useCanDeleteVenueChatMessages(venue);

  const [
    messagesToDisplay,
    infiniteActions,
  ] = useRenderInfiniteScrollChatMessages(allMessagesToDisplay);

  return (
    <Chatbox
      // poll is available for Venue Chat only (displayPoll = true)
      displayPoll
      messages={messagesToDisplay}
      sendMessage={sendMessage}
      sendThreadReply={sendThreadReply}
      deleteMessage={canDeleteMessages ? deleteMessage : undefined}
      containerClassName="venue-chat"
      {...infiniteActions}
    />
  );
};

export const VenueChat = React.memo(_VenueChat, isEqual);
