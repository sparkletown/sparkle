import { useAsync } from "react-use";
import {
  doc,
  DocumentData,
  getDoc,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import { getVenueRef } from "api/venue";

import { DistributedCounterValue } from "types/Firestore";
import { SpaceId } from "types/id";

const toFirestore = ({ value }: DistributedCounterValue): DocumentData => ({
  value,
});

const fromFirestore = (
  snapshot: QueryDocumentSnapshot
): DistributedCounterValue => ({ value: snapshot.data().value });

const CONVERTER = {
  fromFirestore: fromFirestore,
  toFirestore: toFirestore,
};

export const useVenueChatMessagesCount = (spaceId?: SpaceId) => {
  const { value } = useAsync(async () => {
    if (!spaceId) return undefined;

    const reference = doc(
      getVenueRef(spaceId),
      "chatMessagesCounter",
      "sum"
    ).withConverter(CONVERTER);

    const snapshot = await getDoc(reference);

    return snapshot?.data()?.value;
  });

  return value ?? Number.MAX_VALUE;
};
