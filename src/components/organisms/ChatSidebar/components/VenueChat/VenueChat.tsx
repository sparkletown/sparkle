import React, { useState } from "react";
import { isEqual } from "lodash";

import { MessageToDisplay } from "types/chat";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useRenderMessagesCount } from "hooks/chats/util/useRenderInfiniteScroll";
import {
  useDeleteVenueChatMessage,
  useDeleteVenueThreadMessage,
  useSendVenueChatMessage,
  useSendVenueThreadMessage,
} from "hooks/chats/venue/useVenueChatActions";
import { useVenueChatMessages } from "hooks/chats/venue/useVenueChatMessages";
import { useVenueChatMessagesCount } from "hooks/chats/venue/useVenueChatMessagesCount";
import { useVenueChatThreadMessages } from "hooks/chats/venue/useVenueChatThreadMessages";
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
  const [thread, setThread] = useState<WithId<MessageToDisplay>>();

  const messages = useVenueChatMessages(venue.id, limit);
  const threadMessages = useVenueChatThreadMessages(venue.id, thread?.id);

  const { data: allChatMessagesCount } = useVenueChatMessagesCount(venueId);

  return (
    <Chatbox
      // poll is available for Venue Chat only (displayPoll = true)
      displayPoll
      messages={messages}
      threadMessages={threadMessages}
      sendMessage={sendChatMessage}
      sendThreadMessage={sendThreadMessage}
      deleteMessage={canDeleteMessages ? deleteChatMessage : undefined}
      deleteThreadMessage={canDeleteMessages ? deleteThreadMessage : undefined}
      selectedThread={thread}
      setSelectedThread={setThread}
      containerClassName="venue-chat"
      hasMore={limit < allChatMessagesCount}
      loadMore={increaseLimit}
    />
  );
};

export const VenueChat = React.memo(_VenueChat, isEqual);
