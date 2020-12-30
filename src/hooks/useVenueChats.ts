import { useSparkleFirestoreConnect } from "hooks/useSparkleFirestoreConnect";

import { venueChatsSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

export const useVenueChatConnect = (venueId?: string) => {
  useSparkleFirestoreConnect(
    venueId
      ? [
          {
            collection: "venues",
            doc: venueId,
            subcollections: [{ collection: "chats" }],
            storeAs: "venueChats",
          },
        ]
      : undefined
  );
};

export const useVenueChats = (venueId?: string) => {
  useVenueChatConnect(venueId);

  return useSelector(venueChatsSelector);
};
