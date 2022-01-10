import { limit, Query, query } from "firebase/firestore";

import { MessageToDisplay, VenueChatMessage } from "types/chat";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

import { useChatMessagesRaw } from "hooks/chats/common/useChatMessages";
import { getChatsRef } from "hooks/chats/venue/util";

export const useVenueChatMessages = (
  venueId: string,
  limitNumber?: number
): WithId<MessageToDisplay<VenueChatMessage>>[] =>
  useChatMessagesRaw(
    query(
      getChatsRef(venueId) as unknown as Query<unknown>,
      ...(limitNumber ? [limit(limitNumber)] : [])
    ).withConverter<VenueChatMessage>(withIdConverter())
  )[0];
