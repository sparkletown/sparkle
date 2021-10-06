import React, { useState } from "react";
import { isEqual } from "lodash";

import { MessageToDisplay } from "types/chat";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useRenderMessagesCount } from "hooks/chats/util/useRenderInfiniteScroll";
import { useVenueChatActions } from "hooks/chats/venue/useVenueChatActions";
import { useVenueChatMessages } from "hooks/chats/venue/useVenueChatMessages";
import { useVenueChatThreadMessages } from "hooks/chats/venue/useVenueChatThreadMessages";
import { useCanDeleteVenueChatMessages } from "hooks/useCanDeleteVenueChatMessages";

import { Chatbox } from "components/molecules/Chatbox";

import "./VenueChat.scss";

export interface VenueChatProps {
  venue: WithId<AnyVenue>;
}

export const _VenueChat: React.FC<VenueChatProps> = ({ venue }) => {
  let actions = useVenueChatActions(venue.id);

  const canDeleteMessages = useCanDeleteVenueChatMessages(venue);
  if (!canDeleteMessages)
    actions = {
      ...actions,
      deleteMessage: undefined,
      deleteThreadReply: undefined,
    };

  const [limit, increaseLimit] = useRenderMessagesCount();
  const [thread, setThread] = useState<WithId<MessageToDisplay>>();

  const messages = useVenueChatMessages(venue.id, limit);
  const threadMessages = useVenueChatThreadMessages(venue.id, thread?.id);

  return (
    <Chatbox
      // poll is available for Venue Chat only (displayPoll = true)
      displayPoll
      messages={messages}
      threadMessages={threadMessages}
      {...actions}
      selectedThread={thread}
      setSelectedThread={setThread}
      containerClassName="venue-chat"
      hasMore={true}
      loadMore={increaseLimit}
    />
  );
};

export const VenueChat = React.memo(_VenueChat, isEqual);
