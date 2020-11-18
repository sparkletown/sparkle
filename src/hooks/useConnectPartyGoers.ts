import { useFirestoreConnect } from "react-redux-firebase";

import { partygoersSelector } from "utils/selectors";

import { useSelector } from "./useSelector";
import { useUserLastSeenLimit } from "./useUserLastSeenLimit";

// @debt rename this useConnectPartygoers for consistency
export const useConnectPartyGoers = () => {
  const userLastSeenLimit = useUserLastSeenLimit();

  useFirestoreConnect([
    {
      collection: "users",
      where: [["lastSeenAt", ">", userLastSeenLimit]],
      storeAs: "partygoers",
    },
  ]);

  return useSelector(partygoersSelector);
};

/**
 * @deprecated use named export instead
 */
export default useConnectPartyGoers;
