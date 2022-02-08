import { useFirestore } from "reactfire";
import { collection, limit, query } from "firebase/firestore";

import { COLLECTION_SPACE_CHATS, COLLECTION_SPACES } from "settings";

import { MessageToDisplay, VenueChatMessage } from "types/chat";

import { identityConverter } from "utils/converters";
import { convertToFirestoreKey, WithId } from "utils/id";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";

export const useVenueChatMessages = (
  spaceId: string,
  limitNumber?: number
): WithId<MessageToDisplay<VenueChatMessage>>[] => {
  const firestore = useFirestore();
  return useChatMessagesRaw(
    query(
      collection(
        firestore,
        COLLECTION_SPACES,
        convertToFirestoreKey(spaceId),
        COLLECTION_SPACE_CHATS
      ),
      ...(limitNumber ? [limit(limitNumber)] : [])
    ).withConverter(identityConverter<VenueChatMessage>())
  )[0];
};
