import React from "react";
import { isEqual } from "lodash";

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
import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { Chatbox } from "components/molecules/Chatbox";
import { ChatboxContextProvider } from "components/molecules/Chatbox/components/context/ChatboxContext";

const SpaceChat: React.FC = () => {
  const { world, space, spaceId } = useWorldAndSpaceByParams();

  const [limit, increaseLimit] = useRenderMessagesCount();
  const sendChatMessage = useSendVenueChatMessage(spaceId);
  const sendThreadMessage = useSendVenueThreadMessage(spaceId);
  const deleteChatMessage = useDeleteVenueChatMessage(spaceId);
  const deleteThreadMessage = useDeleteVenueThreadMessage(spaceId);
  const allChatMessagesCount = useVenueChatMessagesCount(spaceId);
  const messages = useVenueChatMessages(spaceId, limit);
  const canDeleteMessages = useCanDeleteVenueChatMessages({ space, world });

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

export const VenueChat: React.FC = React.memo(SpaceChat, isEqual);
