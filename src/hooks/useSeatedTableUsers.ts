import { ALWAYS_EMPTY_ARRAY } from "settings";

import { TableSeatedUser } from "types/User";

import { WithId } from "utils/id";
import { currentSeatedTableUsersSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

export const useSeatedTableUsers = (
  venueId: string | undefined
): [WithId<TableSeatedUser>[], boolean] => {
  useConnectSeatedTableUsers(venueId);

  const seatedTableUsers = useSelector(currentSeatedTableUsersSelector);

  return [seatedTableUsers ?? ALWAYS_EMPTY_ARRAY, isLoaded(seatedTableUsers)];
};

const useConnectSeatedTableUsers = (venueId: string | undefined) => {
  useFirestoreConnect(() => {
    if (!venueId) return [];

    return [
      {
        collection: "venues",
        doc: venueId,
        subcollections: [{ collection: "sections" }],
        storeAs: "currentSeatedTableUsers",
      },
    ];
  });
};
