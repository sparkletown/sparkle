import { collection, getFirestore, limit, query } from "firebase/firestore";

import { COLLECTION_SPACE_CHATS, COLLECTION_SPACES, DEFERRED } from "settings";

import { MessageToDisplay, VenueChatMessage } from "types/chat";
import { SpaceId } from "types/id";

import { identityConverter } from "utils/converters";
import { WithId } from "utils/id";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";

export const useVenueChatMessages = (
  spaceId?: SpaceId,
  limitNumber?: number
): WithId<MessageToDisplay<VenueChatMessage>>[] =>
  useChatMessagesRaw(
    spaceId
      ? query(
          collection(
            getFirestore(),
            COLLECTION_SPACES,
            spaceId,
            COLLECTION_SPACE_CHATS
          ),
          ...(limitNumber ? [limit(limitNumber)] : [])
        ).withConverter(identityConverter<VenueChatMessage>())
      : DEFERRED
  )[0];
