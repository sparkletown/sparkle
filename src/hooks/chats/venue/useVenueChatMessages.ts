import { useMemo } from "react";
import { collection, getFirestore, limit, query } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  COLLECTION_SPACE_CHATS,
  COLLECTION_SPACES,
} from "settings";

import { MessageToDisplay, VenueChatMessage } from "types/chat";

import { identityConverter } from "utils/converters";
import { WithId } from "utils/id";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";

export const useVenueChatMessages = (
  spaceId: string,
  limitNumber?: number
): WithId<MessageToDisplay<VenueChatMessage>>[] =>
  useChatMessagesRaw(
    useMemo(
      () =>
        query(
          collection(
            getFirestore(),
            COLLECTION_SPACES,
            spaceId,
            COLLECTION_SPACE_CHATS
          ),
          ...(limitNumber ? [limit(limitNumber)] : ALWAYS_EMPTY_ARRAY)
        ).withConverter(identityConverter<VenueChatMessage>()),
      [spaceId, limitNumber]
    )
  )[0];
