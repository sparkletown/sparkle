import { useEffect, useState } from "react";
import { getHoursAgoInSeconds } from "utils/time";
import { useFirestoreConnect } from "react-redux-firebase";

const useConnectPartyGoers = () => {
  const [userLastSeenLimit, setUserLastSeenLimit] = useState(
    getHoursAgoInSeconds(3)
  );
  useEffect(() => {
    const id = setInterval(() => {
      setUserLastSeenLimit(getHoursAgoInSeconds(3));
    }, 5 * 60 * 1000);

    return () => clearInterval(id);
  }, [setUserLastSeenLimit]);

  useFirestoreConnect([
    {
      collection: "users",
      where: [["lastSeenAt", ">", userLastSeenLimit]],
      storeAs: "partygoers",
    },
  ]);
};

export default useConnectPartyGoers;
