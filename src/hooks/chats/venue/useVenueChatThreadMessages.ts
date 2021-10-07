import { NON_EXISTENT_FIRESTORE_ID } from "settings";

import { BaseChatMessage } from "types/chat";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";
import { getThreadRef } from "hooks/chats/venue/util";

export const useVenueChatThreadMessages = (
  venueId: string,
  threadId: string | undefined
) =>
  useChatMessagesRaw<BaseChatMessage>(
    getThreadRef(venueId, threadId ?? NON_EXISTENT_FIRESTORE_ID)
  )[0];
