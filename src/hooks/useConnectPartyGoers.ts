import { useFirestoreConnect } from "react-redux-firebase";
import { useUserLastSeenLimit } from "./useUserLastSeenLimit";

const useConnectPartyGoers = () => {
  const userLastSeenLimit = useUserLastSeenLimit();

  useFirestoreConnect([
    {
      collection: "users",
      where: [["lastSeenAt", ">", userLastSeenLimit]],
      storeAs: "partygoers",
    },
  ]);
};

export default useConnectPartyGoers;
