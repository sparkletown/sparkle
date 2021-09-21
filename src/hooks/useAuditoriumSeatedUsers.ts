import { User } from "types/User";

import { WithId } from "utils/id";
import {
  currentAuditoriumSectionSeatedUsersSelector,
  emptyArray,
} from "utils/selectors";

import { useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

export const findAuditoriumSeatedUsers = (
  recentVenueUsers: readonly WithId<User>[],
  venueId: string | undefined,
  sectionId: string | undefined
) => {
  return sectionId && venueId
    ? recentVenueUsers.filter(
        (user) => user.data?.[venueId]?.sectionId === sectionId
      )
    : emptyArray;
};

const useConnectAuditoriumSectionSeatedUsers = (
  venueId: string | undefined,
  sectionId: string | undefined
) => {
  useFirestoreConnect(() => {
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
  venueId: string | undefined,
  sectionId: string | undefined
) => {
  useConnectAuditoriumSectionSeatedUsers(venueId, sectionId);

  return useSelector(currentAuditoriumSectionSeatedUsersSelector);
};
