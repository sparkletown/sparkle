import { useMemo } from "react";

import { privateChatMessagesSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "../../useFirestoreConnect";
import { useSelector } from "../../useSelector";
import { useUser } from "../../useUser";

export const usePrivateChatMessages = () => {
  useConnectPrivateChatMessages();

  const privateChatMessages = useSelector(privateChatMessagesSelector);

  return useMemo(
    () => ({
      privateChatMessages: privateChatMessages ?? [],
      isUserPrivateChatsLoaded: isLoaded(privateChatMessages),
    }),
    [privateChatMessages]
  );
};

const useConnectPrivateChatMessages = () => {
  const { user } = useUser();

  useFirestoreConnect(() => {
    if (!user?.uid) return [];

    return [
      {
        collection: "privatechats",
        doc: user.uid,
        subcollections: [{ collection: "chats" }],
        storeAs: "privateChatMessages",
      },
    ];
  });
};
