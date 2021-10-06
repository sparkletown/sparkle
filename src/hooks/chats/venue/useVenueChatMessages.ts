import firebase from "firebase/app";

import { MessageToDisplay, VenueChatMessage } from "types/chat";

import { WithId } from "utils/id";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";
import { getChatsRef } from "hooks/chats/venue/useVenueChatActions";

export const useVenueChatMessages = (
  venueId: string | undefined,
  limit?: number
): WithId<MessageToDisplay<VenueChatMessage>>[] => {
  let ref: firebase.firestore.Query = getChatsRef(venueId);
  if (limit) ref = ref.limit(limit);
  const [venueChatMessages] = useChatMessagesRaw<VenueChatMessage>(ref);

  return venueChatMessages;
};
