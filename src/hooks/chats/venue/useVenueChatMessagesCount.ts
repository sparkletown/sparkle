import { useFirestoreDocData } from "reactfire";

import { getVenueRef } from "api/venue";

import { distributedCounterValueConverter } from "utils/converters";

export const useVenueChatMessagesCount = (venueId: string | undefined) =>
  useFirestoreDocData<number>(
    getVenueRef(venueId)
      .collection("chatMessagesCounter")
      .doc("counter")
      .withConverter(distributedCounterValueConverter)
  );
