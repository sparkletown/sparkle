import { useMemo } from "react";

import { PreviewChatMessageMap } from "types/chat";

import { chatSort, getPreviewChatMessage } from "utils/chat";

import { useUser } from "hooks/useUser";

import { usePrivateChatMessages } from "./usePrivateChatMessages";

export const usePrivateChatPreviews = () => {
  const { userId } = useUser();
  const {
    privateChatMessages,
    isUserPrivateChatsLoaded,
  } = usePrivateChatMessages();

  const privateChatPreviewsMap: PreviewChatMessageMap = useMemo(
    () =>
      privateChatMessages.reduce<PreviewChatMessageMap>((acc, message) => {
        if (!userId) return acc;
        const { from, to, ts_utc } = message;

        // Either `from` author or `to` author is Me. Filter me out
        const counterPartyUser = from.id === userId ? to : from;

        // Filter out not existent users
        if (!counterPartyUser) return acc;

        if (counterPartyUser.id in acc) {
          const previousMessage = acc[counterPartyUser.id];

          // If the message is older, replace it with the more recent one
          if (previousMessage.ts_utc > ts_utc) return acc;

          return {
            ...acc,
            [counterPartyUser.id]: getPreviewChatMessage({
              message,
              user: counterPartyUser,
            }),
          };
        }

        return {
          ...acc,
          [counterPartyUser.id]: getPreviewChatMessage({
            message,
            user: counterPartyUser,
          }),
        };
      }, {}),
    [privateChatMessages, userId]
  );

  return useMemo(
    () => ({
      privateChatPreviews: Object.values(privateChatPreviewsMap).sort(chatSort),
      isPrivateChatPreviewsLoaded: isUserPrivateChatsLoaded,
    }),
    [privateChatPreviewsMap, isUserPrivateChatsLoaded]
  );
};
