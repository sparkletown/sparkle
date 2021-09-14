import { User } from "types/User";

import { WithId } from "utils/id";
import { currentModalUserSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

const useConnectCurrentModalUser = (userId?: string) => {
  useFirestoreConnect([
    {
      collection: "users",
      doc: userId ?? "",
      storeAs: "currentModalUser",
    },
  ]);
};

export const useCurrentModalUser = (
  userId?: string
): [WithId<User> | undefined, boolean] => {
  useConnectCurrentModalUser(userId);

  const user = useSelector(currentModalUserSelector);

  return [user?.[0], isLoaded(user)];
};
