import {
  ALWAYS_EMPTY_ARRAY,
  COLLECTION_SECTIONS,
  COLLECTION_SPACES,
} from "settings";

import { AuditoriumSeatedUser, AuditoriumSectionPath } from "types/auditorium";

import { WithId } from "utils/id";

import { useFireCollection } from "hooks/fire/useFireCollection";

export const useAuditoriumSeatedUsers = ({
  venueId,
  sectionId,
}: AuditoriumSectionPath): WithId<AuditoriumSeatedUser>[] => {
  const { data: users = ALWAYS_EMPTY_ARRAY } = useFireCollection<
    WithId<AuditoriumSeatedUser>
  >([
    COLLECTION_SPACES,
    venueId,
    COLLECTION_SECTIONS,
    sectionId,
    "seatedSectionUsers",
  ]);

  return users;
};
