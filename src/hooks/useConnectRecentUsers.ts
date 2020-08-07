import { useState } from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import dayjs from "dayjs";

// Prevent App Crash by only loading users who connected after yesterday
// @debt performance this has to be fixed better
const useConnectRecentUsers = () => {
  const [yesterday] = useState(dayjs().add(-1, "day").unix());
  useFirestoreConnect([
    {
      collection: "users",
      where: [["lastSeenAt", ">", yesterday]],
      storeAs: "users",
    },
  ]);
};

export default useConnectRecentUsers;
