import { useFirestoreConnect } from "react-redux-firebase";

// Prevent App Crash by only loading users who connected after the 31st of July
// @debt performance this has to be fixed better
const useConnectRecentUsers = () => {
  useFirestoreConnect([
    {
      collection: "users",
      where: [["lastSeenAt", ">", 1596060000]],
      storeAs: "users",
    },
  ]);
};

export default useConnectRecentUsers;
