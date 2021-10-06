import firebase from "firebase/app";

import { BaseChatMessage } from "types/chat";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";
import { getThreadsRef } from "hooks/chats/venue/useVenueChatActions";

export const useVenueChatThreadMessages = (
  venueId: string | undefined,
  threadId: string | undefined,
  limit?: number
) => {
  let ref: firebase.firestore.Query = getThreadsRef(venueId, threadId);
  if (limit) ref = ref.limit(limit);

  return useChatMessagesRaw<BaseChatMessage>(ref)[0];
};
