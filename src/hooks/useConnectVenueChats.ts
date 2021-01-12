import { useSparkleFirestoreConnect } from "hooks/useSparkleFirestoreConnect";

export const useConnectVenueChats = (venueId?: string) => {
  useSparkleFirestoreConnect(
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
