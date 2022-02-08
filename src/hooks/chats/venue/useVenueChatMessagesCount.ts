import { useFirestoreDocData } from "reactfire";
import { doc, DocumentReference } from "firebase/firestore";

import { getVenueRef } from "api/venue";

import { DistributedCounterValue } from "types/Firestore";

import { CONVERTER_DISTRIBUTED_COUNTER_VALUE } from "utils/converters";

export const useVenueChatMessagesCount = (venueId: string) => {
  const venueRef = (getVenueRef(venueId) as unknown) as DocumentReference;
  return (
    useFirestoreDocData<DistributedCounterValue>(
      doc(venueRef, "chatMessagesCounter", "sum").withConverter(
        CONVERTER_DISTRIBUTED_COUNTER_VALUE
      )
    )?.data?.value ?? Number.MAX_VALUE
  );
};
