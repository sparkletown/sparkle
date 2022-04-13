import { useMemo } from "react";
import { collection, getFirestore, query } from "firebase/firestore";

import { COLLECTION_PRIVATE_CHATS, DEFERRED } from "settings";

import { PreviewChatMessageMap, PrivateChatMessage } from "types/chat";

import { getPreviewChatMessage } from "utils/chat";
import { withIdConverter } from "utils/converters";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";
import { useUserId } from "hooks/user/useUserId";

export const usePrivateChatPreviews = () => {
  const { userId } = useUserId();

  const [privateChatMessages, isUserPrivateChatsLoaded] = useChatMessagesRaw(
    useMemo(() => {
      if (!userId) return DEFERRED;

      return query<PrivateChatMessage>(
        collection(
          getFirestore(),
          COLLECTION_PRIVATE_CHATS,
          userId,
          "chats"
        ).withConverter<PrivateChatMessage>(withIdConverter())
      );
    }, [userId])
  );

  const privateChatPreviewsMap: PreviewChatMessageMap = useMemo(
    () =>
      privateChatMessages.reduce<PreviewChatMessageMap>((acc, message) => {
        if (!userId) return acc;
        const { fromUser, toUser, timestamp } = message;

        // Either `from` author or `to` author is Me. Filter me out
        const counterPartyUser = fromUser.id === userId ? toUser : fromUser;

        // Filter out not existent users
        if (!counterPartyUser) return acc;

        if (counterPartyUser.id in acc) {
          const previousMessage = acc[counterPartyUser.id];

          // If the message is older, replace it with the more recent one
          if (previousMessage.timestamp > timestamp) return acc;

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
      privateChatPreviews: Object.values(privateChatPreviewsMap),
      isPrivateChatPreviewsLoaded: isUserPrivateChatsLoaded,
    }),
    [privateChatPreviewsMap, isUserPrivateChatsLoaded]
  );
};
