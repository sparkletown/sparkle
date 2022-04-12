import { useMemo } from "react";
import {
  collection,
  CollectionReference,
  getFirestore,
} from "firebase/firestore";

import { COLLECTION_SPACES, NON_EXISTENT_FIRESTORE_ID } from "settings";

import { BaseChatMessage } from "types/chat";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";

export const useVenueChatThreadMessages = (
  venueId: string,
  threadId: string | undefined
) =>
  useChatMessagesRaw(
    useMemo(
      () =>
        collection(
          getFirestore(),
          COLLECTION_SPACES,
          venueId,
          "chats",
          threadId ?? NON_EXISTENT_FIRESTORE_ID,
          "thread"
        ) as CollectionReference<BaseChatMessage>,
      [venueId, threadId]
    )
  );
