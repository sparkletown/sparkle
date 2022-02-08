import { useFirestore } from "reactfire";
import { collection, CollectionReference } from "firebase/firestore";

import { COLLECTION_SPACES, NON_EXISTENT_FIRESTORE_ID } from "settings";

import { BaseChatMessage } from "types/chat";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";

export const useVenueChatThreadMessages = (
  venueId: string,
  threadId: string | undefined
) => {
  const firestore = useFirestore();
  const messagesRef = collection(
    firestore,
    COLLECTION_SPACES,
    venueId,
    "chats",
    threadId ?? NON_EXISTENT_FIRESTORE_ID,
    "thread"
  ) as CollectionReference<BaseChatMessage>;
  return useChatMessagesRaw(messagesRef);
};
