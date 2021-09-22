import { AuditoriumSectionPath } from "types/auditorium";

import { currentAuditoriumSectionSeatedUsersSelector } from "utils/selectors";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

const useConnectAuditoriumSectionSeatedUsers = (
  path: Partial<AuditoriumSectionPath>
) => {
  useFirestoreConnect(() => {
    const { venueId, sectionId } = path;

    if (!venueId || !sectionId) return [];

    return [
      {
        collection: "venues",
        doc: venueId,
        subcollections: [
          { collection: "sections", doc: sectionId },
          {
            collection: "seatedSectionUsers",
          },
        ],
        storeAs: "currentAuditoriumSeatedSectionUsers",
      },
    ];
  });
};

export const useAuditoriumSeatedUsers = (
  path: Partial<AuditoriumSectionPath>
) => {
  useConnectAuditoriumSectionSeatedUsers(path);

  return useSelector(currentAuditoriumSectionSeatedUsersSelector);
};
