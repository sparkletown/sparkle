import { useMemo } from "react";
import { useFirestore } from "reactfire";

import { PreviewChatMessageMap, PrivateChatMessage } from "types/chat";

import { chatSort, getPreviewChatMessage } from "utils/chat";

import { useChatMessagesRaw } from "hooks/chats/useChatMessages";
import { useUser } from "hooks/useUser";

export const usePrivateChatPreviews = () => {
  const { userId } = useUser();
  const firestore = useFirestore();

  const [
    privateChatMessages,
    isUserPrivateChatsLoaded,
  ] = useChatMessagesRaw<PrivateChatMessage>(
    firestore.collection("privatechats").doc(userId).collection("chats")
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
      privateChatPreviews: Object.values(privateChatPreviewsMap).sort(chatSort),
      isPrivateChatPreviewsLoaded: isUserPrivateChatsLoaded,
    }),
    [privateChatPreviewsMap, isUserPrivateChatsLoaded]
  );
};
