import { useFirestoreConnect } from "react-redux-firebase";

import { partygoersSelector } from "utils/selectors";
import { WithId } from "utils/id";

import { useSelector } from "./useSelector";
import { useUserLastSeenThreshold } from "./useUserLastSeenThreshold";

import { User } from "types/User";

const useConnectPartyGoers = () => {
  const lastSeenThreshold = useUserLastSeenThreshold();

  useFirestoreConnect([
    {
      collection: "users",
      where: [["lastSeenAt", ">", lastSeenThreshold]],
      storeAs: "partygoers",
    },
  ]);

  return useSelector(partygoersSelector);
};

export const usePartygoers = (): WithId<User>[] => {
  useConnectPartyGoers();

  return useSelector(partygoersSelector);
};
