import { User } from "types/User";

import { WithId, withId } from "utils/id";
import { currentModalUserDataSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

const useConnectCurrentModalUser = (userId?: string) => {
  useFirestoreConnect(() => {
    if (!userId) return [];

    return [
      {
        collection: "users",
        doc: userId,
        storeAs: "currentModalUser",
      },
    ];
  });
};

export const useCurrentModalUser = (
  userId?: string
): [WithId<User> | undefined, boolean] => {
  useConnectCurrentModalUser(userId);

  const user = useSelector(currentModalUserDataSelector);

  return [user && userId ? withId(user, userId) : undefined, isLoaded(user)];
};
