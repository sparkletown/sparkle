import { collection, getFirestore, limit, query } from "firebase/firestore";

import { COLLECTION_SPACE_CHATS, COLLECTION_SPACES } from "settings";

import { MessageToDisplay, VenueChatMessage } from "types/chat";

import { identityConverter } from "utils/converters";
import { convertToFirestoreKey, WithId } from "utils/id";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";

export const useVenueChatMessages = (
  spaceId: string,
  limitNumber?: number
): WithId<MessageToDisplay<VenueChatMessage>>[] =>
  useChatMessagesRaw(
    query(
      collection(
        getFirestore(),
        COLLECTION_SPACES,
        convertToFirestoreKey(spaceId),
        COLLECTION_SPACE_CHATS
      ),
      ...(limitNumber ? [limit(limitNumber)] : [])
    ).withConverter(identityConverter<VenueChatMessage>())
  )[0];
