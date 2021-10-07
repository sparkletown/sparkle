import React from "react";
import { isEqual } from "lodash";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { ChatboxContextProvider } from "hooks/chats/private/ChatboxContext";
import { useRenderMessagesCount } from "hooks/chats/util/useRenderInfiniteScroll";
import {
  useDeleteVenueChatMessage,
  useDeleteVenueThreadMessage,
  useSendVenueChatMessage,
  useSendVenueThreadMessage,
} from "hooks/chats/venue/useVenueChatActions";
import { useVenueChatMessages } from "hooks/chats/venue/useVenueChatMessages";
import { useVenueChatMessagesCount } from "hooks/chats/venue/useVenueChatMessagesCount";
import { useCanDeleteVenueChatMessages } from "hooks/useCanDeleteVenueChatMessages";

import { Chatbox } from "components/molecules/Chatbox";

import "./VenueChat.scss";

export interface VenueChatProps {
  venue: WithId<AnyVenue>;
}

export const _VenueChat: React.FC<VenueChatProps> = ({ venue }) => {
  const venueId = venue.id;

  const sendChatMessage = useSendVenueChatMessage(venueId);
  const sendThreadMessage = useSendVenueThreadMessage(venueId);
  const deleteChatMessage = useDeleteVenueChatMessage(venueId);
  const deleteThreadMessage = useDeleteVenueThreadMessage(venueId);

  const canDeleteMessages = useCanDeleteVenueChatMessages(venue);

  const [limit, increaseLimit] = useRenderMessagesCount();

  const messages = useVenueChatMessages(venue.id, limit);

  const { data: allChatMessagesCount } = useVenueChatMessagesCount(venueId);

  return (
    <ChatboxContextProvider
      venueId={venue.id}
      sendChatMessage={sendChatMessage}
      sendThreadMessage={sendThreadMessage}
      deleteChatMessage={canDeleteMessages ? deleteChatMessage : undefined}
      deleteThreadMessage={canDeleteMessages ? deleteThreadMessage : undefined}
    >
      <Chatbox
        // poll is available for Venue Chat only (displayPoll = true)
        displayPoll
        messages={messages}
        threadMessages={[]}
        containerClassName="venue-chat"
        hasMore={limit < allChatMessagesCount}
        loadMore={increaseLimit}
      />
    </ChatboxContextProvider>
  );
};

export const VenueChat = React.memo(_VenueChat, isEqual);
