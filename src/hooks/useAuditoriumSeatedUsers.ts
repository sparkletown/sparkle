import { User } from "types/User";

import { WithId } from "utils/id";
import { emptyArray } from "utils/selectors";

import { useRecentVenueUsers } from "hooks/users";

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

export const useAuditoriumSeatedUsers = (
  venueId: string | undefined,
  sectionId: string | undefined
) => {
  const { recentVenueUsers } = useRecentVenueUsers({ venueId });

  return findAuditoriumSeatedUsers(recentVenueUsers, venueId, sectionId);
};
