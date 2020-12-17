import { useEffect } from "react";
import { useFirestoreConnect } from "react-redux-firebase";

import { partygoersSelector } from "utils/selectors";

import { useSelector } from "./useSelector";
import { useUserLastSeenThreshold } from "./useUserLastSeenThreshold";

export const useConnectPartyGoers = () => {
  const lastSeenThreshold = useUserLastSeenThreshold();

  useEffect(() => {
    console.count("Created a listener to fetch data");
  }, []);

  useFirestoreConnect([
    {
      collection: "users",
      where: [["lastSeenAt", ">", lastSeenThreshold]],
      storeAs: "partygoers",
    },
  ]);

  return useSelector(partygoersSelector);
};

/**
 * @deprecated use named export instead
 */
export default useConnectPartyGoers;
