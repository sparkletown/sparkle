import React from "react";

import { SpaceWithId,WorldAndSpaceIdLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

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

type WithMessagesInProps<T> = T &
  WorldAndSpaceIdLocation & { space: SpaceWithId };

export const withMessages = <T>(
  Component: React.FC<WithMessagesInProps<T>>
) => {
  const WithMessages = (props: WithMessagesInProps<T>) => {
    const space = props.space;
    const spaceId = space.id;
    const sendChatMessage = useSendVenueChatMessage(spaceId);
    const sendThreadMessage = useSendVenueThreadMessage(spaceId);
    const deleteChatMessage = useDeleteVenueChatMessage(spaceId);
    const deleteThreadMessage = useDeleteVenueThreadMessage(spaceId);
    const canDeleteMessages = useCanDeleteVenueChatMessages(space);
    const [limit, increaseLimit] = useRenderMessagesCount();
    const messages = useVenueChatMessages(spaceId, limit);
    const allChatMessagesCount = useVenueChatMessagesCount(spaceId);

    return React.createElement(Component, {
      ...props,
      sendChatMessage,
      sendThreadMessage,
      deleteChatMessage,
      deleteThreadMessage,
      canDeleteMessages,
      limit,
      increaseLimit,
      messages,
      allChatMessagesCount,
    });
  };

  hoistHocStatics("withMessages", WithMessages, Component);
  return WithMessages;
};
