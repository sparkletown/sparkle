import { useFirestore, useFirestoreCollectionData } from "reactfire";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { AuditoriumSeatedUser, AuditoriumSectionPath } from "types/auditorium";

import { auditoriumSeatedUserConverter } from "utils/converters";
import { WithId } from "utils/id";

export const useAuditoriumSeatedUsers = ({
  venueId,
  sectionId,
}: AuditoriumSectionPath): WithId<AuditoriumSeatedUser>[] => {
  const firestore = useFirestore();
  const relatedVenuesRef = firestore
    .collection("venues")
    .doc(venueId)
    .collection("sections")
    .doc(sectionId)
    .collection("seatedSectionUsers")
    .withConverter(auditoriumSeatedUserConverter);

  const { data: users } = useFirestoreCollectionData<
    WithId<AuditoriumSeatedUser>
  >(relatedVenuesRef, {
    initialData: ALWAYS_EMPTY_ARRAY,
  });

  return users;
};
