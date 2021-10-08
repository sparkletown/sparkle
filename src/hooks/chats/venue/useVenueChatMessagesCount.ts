import { useFirestoreDocData } from "reactfire";

import { getVenueRef } from "api/venue";

import { DistributedCounterValue } from "types/Firestore";

import { distributedCounterValueConverter } from "utils/converters";

export const useVenueChatMessagesCount = (venueId: string) =>
  useFirestoreDocData<DistributedCounterValue>(
    getVenueRef(venueId)
      .collection("chatMessagesCounter")
      .doc("counter")
      .withConverter(distributedCounterValueConverter)
  )?.data?.sum ?? Number.MAX_VALUE;
