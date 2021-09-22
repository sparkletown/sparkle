import { ALWAYS_EMPTY_ARRAY } from "settings";

import { AuditoriumSectionPath } from "types/auditorium";
import { AuditoriumSeatedUser } from "types/User";

import { WithId } from "utils/id";
import { currentAuditoriumSectionSeatedUsersSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "hooks/useFirestoreConnect";
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
): [WithId<AuditoriumSeatedUser>[], boolean] => {
  useConnectAuditoriumSectionSeatedUsers(path);

  const users = useSelector(currentAuditoriumSectionSeatedUsersSelector);

  return [users ?? ALWAYS_EMPTY_ARRAY, isLoaded(users)];
};
