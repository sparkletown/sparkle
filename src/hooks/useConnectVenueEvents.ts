import { useFirestoreConnect } from "./useFirestoreConnect";

export const useConnectVenueEvents = (venueId?: string) => {
  useFirestoreConnect(
    venueId
      ? [
          {
            collection: "venues",
            doc: venueId,
            subcollections: [{ collection: "events" }],
            orderBy: ["start_utc_seconds", "asc"],
            storeAs: "events",
          },
        ]
      : []
  );
};
