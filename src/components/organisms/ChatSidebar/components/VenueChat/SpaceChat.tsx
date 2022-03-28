import React from "react";

import { SpaceId, SpaceWithId, WorldWithId } from "types/id";

import { useRenderMessagesCount } from "hooks/chats/util/useRenderInfiniteScroll";
import { useCanDeleteVenueChatMessages } from "hooks/chats/venue/useCanDeleteVenueChatMessages";
import {
  useDeleteVenueChatMessage,
  useDeleteVenueThreadMessage,
  useSendVenueChatMessage,
  useSendVenueThreadMessage,
} from "hooks/chats/venue/useVenueChatActions";
import { useVenueChatMessages } from "hooks/chats/venue/useVenueChatMessages";
import { useVenueChatMessagesCount } from "hooks/chats/venue/useVenueChatMessagesCount";

import { Chatbox } from "components/molecules/Chatbox";
import { ChatboxContextProvider } from "components/molecules/Chatbox/components/context/ChatboxContext";

type SpaceChatProps = {
  space: SpaceWithId;
  world: WorldWithId;
};

export const SpaceChat: React.FC<SpaceChatProps> = ({ space, world }) => {
  const spaceId: SpaceId = space.id;

  const [limit, increaseLimit] = useRenderMessagesCount();

  // following hooks don't accept undefined values for spaceId and space
  const messages = useVenueChatMessages(spaceId, limit);
  const allChatMessagesCount = useVenueChatMessagesCount(spaceId);
  const canDeleteMessages = useCanDeleteVenueChatMessages({ space, world });

  // following hooks accept undefined values for spaceId
  const sendChatMessage = useSendVenueChatMessage(spaceId);
  const sendThreadMessage = useSendVenueThreadMessage(spaceId);
  const deleteChatMessage = useDeleteVenueChatMessage(spaceId);
  const deleteThreadMessage = useDeleteVenueThreadMessage(spaceId);

  return (
    <ChatboxContextProvider
      venueId={spaceId}
      sendChatMessage={sendChatMessage}
      sendThreadMessage={sendThreadMessage}
      deleteChatMessage={canDeleteMessages ? deleteChatMessage : undefined}
      deleteThreadMessage={canDeleteMessages ? deleteThreadMessage : undefined}
    >
      <Chatbox
        displayPollOption
        messages={messages}
        containerClassName="venue-chat"
        hasMore={limit < allChatMessagesCount}
        loadMore={increaseLimit}
      />
    </ChatboxContextProvider>
  );
};
