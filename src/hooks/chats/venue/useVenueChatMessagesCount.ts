import { useAsync } from "react-use";
import { doc, getDoc } from "firebase/firestore";

import { getVenueRef } from "api/venue";

import {
  DistributedCounterValue,
  InterimDocumentData,
  InterimQueryDocumentSnapshot,
} from "types/Firestore";
import { SpaceId } from "types/id";

const CONVERTER = {
  fromFirestore: (
    snapshot: InterimQueryDocumentSnapshot<InterimDocumentData>
  ): DistributedCounterValue => ({ value: snapshot.data().value }),
  toFirestore: ({ value }: DistributedCounterValue): InterimDocumentData => ({
    value,
  }),
};

export const useVenueChatMessagesCount = (venueId: SpaceId | string) => {
  const { value } = useAsync(
    async () =>
      (
        await getDoc(
          doc(getVenueRef(venueId), "chatMessagesCounter", "sum").withConverter(
            CONVERTER
          )
        )
      )?.data()?.value
  );

  return value ?? Number.MAX_VALUE;
};
