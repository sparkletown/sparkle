import { useMemo } from "react";

import { User } from "types/User";

import { WithId } from "utils/id";
import { worldUsersSelector } from "utils/selectors";

import { isLoaded } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

import { useConnectWorldUsers } from "./useConnectWorldUsers";

export const useWorldUsers = (): {
  worldUsers: readonly WithId<User>[];
  isWorldUsersLoaded: boolean;
} => {
  useConnectWorldUsers();

  const selectedWorldUsers = useSelector(worldUsersSelector);

  return useMemo(
    () => ({
      worldUsers: selectedWorldUsers ?? [],
      isWorldUsersLoaded: isLoaded(selectedWorldUsers),
    }),
    [selectedWorldUsers]
  );
};
