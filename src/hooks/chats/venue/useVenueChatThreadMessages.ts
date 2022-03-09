import {
  collection,
  CollectionReference,
  getFirestore,
} from "firebase/firestore";

import { COLLECTION_SPACES, DEFERRED } from "settings";

import { BaseChatMessage } from "types/chat";
import { SpaceId } from "types/id";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";

export const useVenueChatThreadMessages = (
  venueId: SpaceId | string,
  threadId: string | undefined
) =>
  useChatMessagesRaw(
    threadId
      ? (collection(
          getFirestore(),
          COLLECTION_SPACES,
          venueId,
          "chats",
          threadId,
          "thread"
        ) as CollectionReference<BaseChatMessage>)
      : DEFERRED
  );
