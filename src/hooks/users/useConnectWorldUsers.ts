import { useEffect } from "react";

import { useWorldUsersContext } from "./useWorldUsers";

export const useConnectWorldUsers = () => {
  // We mostly use this here to ensure that the WorldUsersProvider has definitely been connected
  useWorldUsersContext();

  useEffect(() => {
    console.log(
      "useConnectWorldUsers is practically a noop at the moment, all the real work happens in WorldUsersProvider in src/hooks/users/useWorldUsers.tsx"
    );
  }, []);
};
