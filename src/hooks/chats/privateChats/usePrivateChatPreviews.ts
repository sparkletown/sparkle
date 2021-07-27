import { useUser } from "../../useUser";
import { useWorldUsersById } from "../../users";
import { useMemo } from "react";
import { PreviewChatMessageMap } from "../../../types/chat";
import {
  chatSort,
  getPreviewChatMessage,
  getPreviewChatMessageToDisplay,
} from "../../../utils/chat";
import { withId } from "../../../utils/id";
import { usePrivateChatMessages } from "./usePrivateChatMessages";

export const usePrivateChatPreviews = () => {
  const { user } = useUser();
  const { worldUsersById } = useWorldUsersById();
  const {
    privateChatMessages,
    isUserPrivateChatsLoaded,
  } = usePrivateChatMessages();

  const userId = user?.uid;

  const privateChatPreviewsMap = useMemo(
    () =>
      privateChatMessages.reduce<PreviewChatMessageMap>((acc, message) => {
        if (!userId) return acc;

        const { from: fromUserId, to: toUserId } = message;

        // Either `from` author or `to` author is Me. Filter me out
        const counterPartyUserId =
          fromUserId === userId ? toUserId : fromUserId;

        const counterPartyUser = worldUsersById[counterPartyUserId];

        // Filter out not existent users
        if (!counterPartyUser) return acc;

        if (counterPartyUserId in acc) {
          const previousMessage = acc[counterPartyUserId];

          // If the message is older, replace it with the more recent one
          if (previousMessage.ts_utc > message.ts_utc) return acc;

          return {
            ...acc,
            [counterPartyUserId]: getPreviewChatMessage({
              message,
              user: withId(counterPartyUser, counterPartyUserId),
            }),
          };
        }

        return {
          ...acc,
          [counterPartyUserId]: getPreviewChatMessage({
            message,
            user: withId(counterPartyUser, counterPartyUserId),
          }),
        };
      }, {}),
    [privateChatMessages, userId, worldUsersById]
  );

  return useMemo(
    () => ({
      privateChatPreviews: Object.values(privateChatPreviewsMap)
        .sort(chatSort)
        .map((message) =>
          getPreviewChatMessageToDisplay({ message, myUserId: userId })
        ),
      isPrivateChatPreviewsLoaded: isUserPrivateChatsLoaded,
    }),
    [privateChatPreviewsMap, userId, isUserPrivateChatsLoaded]
  );
};
