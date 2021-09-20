import { useMemo } from "react";

import { PrivateChatMessage } from "types/chat";

import { filterNewSchemaMessages } from "utils/chat";
import { WithId } from "utils/id";
import { privateChatMessagesSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

const noMessages: WithId<PrivateChatMessage>[] = [];

export const usePrivateChatMessages = () => {
  useConnectPrivateChatMessages();

  const privateChatMessages = useSelector(privateChatMessagesSelector);

  return useMemo(
    () => ({
      privateChatMessages:
        filterNewSchemaMessages<PrivateChatMessage>(privateChatMessages) ??
        noMessages,
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
