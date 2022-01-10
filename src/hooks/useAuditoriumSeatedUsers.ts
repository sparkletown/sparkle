import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection, query } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  COLLECTION_SECTIONS,
  COLLECTION_SPACES,
} from "settings";

import { AuditoriumSeatedUser, AuditoriumSectionPath } from "types/auditorium";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

export const useAuditoriumSeatedUsers = ({
  venueId,
  sectionId,
}: AuditoriumSectionPath): WithId<AuditoriumSeatedUser>[] => {
  const firestore = useFirestore();
  const relatedVenuesRef = query(
    collection(
      firestore,
      COLLECTION_SPACES,
      venueId,
      COLLECTION_SECTIONS,
      sectionId,
      "seatedSectionUsers"
    )
  ).withConverter(withIdConverter<AuditoriumSeatedUser>());

  const { data: users } = useFirestoreCollectionData<
    WithId<AuditoriumSeatedUser>
  >(relatedVenuesRef, {
    initialData: ALWAYS_EMPTY_ARRAY,
  });

  return users;
};
