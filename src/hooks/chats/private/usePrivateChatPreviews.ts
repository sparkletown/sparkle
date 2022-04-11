import { useMemo } from "react";
import { useFirestore } from "reactfire";
import { collection, query } from "firebase/firestore";

import { PreviewChatMessageMap, PrivateChatMessage } from "types/chat";

import { getPreviewChatMessage } from "utils/chat";
import { withIdConverter } from "utils/converters";
import { convertToFirestoreKey } from "utils/id";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";
import { useLiveUser } from "hooks/user/useLiveUser";

export const usePrivateChatPreviews = () => {
  const { userId } = useLiveUser();
  const firestore = useFirestore();

  const [
    privateChatMessages,
    isUserPrivateChatsLoaded,
  ] = useChatMessagesRaw<PrivateChatMessage>(
    query<PrivateChatMessage>(
      collection(
        firestore,
        "privatechats",
        convertToFirestoreKey(userId),
        "chats"
      ).withConverter<PrivateChatMessage>(withIdConverter())
    )
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
