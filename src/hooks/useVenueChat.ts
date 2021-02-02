import { useMemo } from "react";

import { venueChatsSelector } from "utils/selectors";
import { chatSort } from "utils/chat";
import { getDaysAgoInSeconds, roundToNearestHour } from "utils/time";

import { VENUE_CHAT_AGE_DAYS } from "settings";
import { ChatMessage } from "store/actions/Chat";

import { useSelector } from "./useSelector";
import { useFirestoreConnect } from "./useFirestoreConnect";
import { useVenueId } from "./useVenueId";
import { WithId } from "utils/id";
import { User } from "types/User";
import { useUser } from "./useUser";
import { useWorldUsersById } from "./users";

export const useConnectVenueChat = (venueId?: string) => {
  useFirestoreConnect(
    venueId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "chats" }],
          storeAs: "venueChats",
        }
      : undefined
  );
};

type DisplayMessage = {
  text: string;
  author: WithId<User>;
  displayDate: firebase.firestore.Timestamp;
  isMyMessage: boolean;
};

const getDisplayChatMessage = (
  message: ChatMessage,
  authorsById: Record<string, User>,
  userId?: string
): DisplayMessage => ({
  text: message.text,
  author: { ...authorsById[message.from], id: message.from },
  displayDate: message.ts_utc,
  isMyMessage: userId === message.from,
});

export const useVenueChat = () => {
  const venueId = useVenueId();
  const { worldUsersById } = useWorldUsersById();
  const { user } = useUser();

  const userId = user?.uid;

  useConnectVenueChat(venueId);

  const chats = useSelector(venueChatsSelector) ?? [];

  const DAYS_AGO = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);
  const HIDE_BEFORE = roundToNearestHour(DAYS_AGO);

  return useMemo(
    () => ({
      venueChatMessages: chats
        .filter(
          (message) =>
            message.deleted !== true &&
            message.type === "room" &&
            message.to === venueId &&
            message.ts_utc.seconds > HIDE_BEFORE
        )
        .sort(chatSort),
    }),
    [chats, venueId, HIDE_BEFORE]
  );
};
