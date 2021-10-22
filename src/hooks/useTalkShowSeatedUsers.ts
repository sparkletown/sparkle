import { useFirestore, useFirestoreCollectionData } from "reactfire";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { TalkShowPath, TalkShowSeatedUser } from "types/talkShow";

import { talkShowSeatedUserConverter } from "utils/converters";
import { WithId } from "utils/id";

export const useTalkShowSeatedUsers = ({
  venueId,
}: TalkShowPath): WithId<TalkShowSeatedUser>[] => {
  const firestore = useFirestore();
  const relatedVenuesRef = firestore
    .collection("venues")
    .doc(venueId)
    .collection("seatedTalkShowUsers")
    .withConverter(talkShowSeatedUserConverter);

  const { data: users } = useFirestoreCollectionData<
    WithId<TalkShowSeatedUser>
  >(relatedVenuesRef, {
    initialData: ALWAYS_EMPTY_ARRAY,
  });

  return users;
};
