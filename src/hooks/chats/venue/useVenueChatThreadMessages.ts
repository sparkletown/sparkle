import firebase from "firebase/app";

import { NON_EXISTENT_FIRESTORE_ID } from "settings";

import { BaseChatMessage } from "types/chat";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";
import { getThreadRef } from "hooks/chats/venue/util";

export const useVenueChatThreadMessages = (
  venueId: string,
  threadId: string | undefined,
  limit?: number
) => {
  let ref: firebase.firestore.Query = getThreadRef(
    venueId,
    threadId ?? NON_EXISTENT_FIRESTORE_ID
  );
  if (limit) ref = ref.limit(limit);

  return useChatMessagesRaw<BaseChatMessage>(ref)[0];
};
