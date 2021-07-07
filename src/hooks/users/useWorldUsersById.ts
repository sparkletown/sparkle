import { isEqual } from "lodash";

import { User } from "types/User";

import { WithId } from "utils/id";
import { worldUsersByIdWithoutLocationSelector } from "utils/selectors";

import { isLoaded } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

import { useConnectWorldUsers } from "./useConnectWorldUsers";

const noUsersById: Record<string, WithId<User>> = {};

/**
 * @debt typing, Record implies that a User will exist for literally any given string, which is untrue
 * @deprecated use useWorldUsersByIdWorkaround until we refactor this to fix the typing issue across the codebase
 */
export const useWorldUsersById = () => {
  useConnectWorldUsers();

  const worldUsersById: Record<string, WithId<User>> | undefined = useSelector(
    worldUsersByIdWithoutLocationSelector,
    isEqual
  );

  return {
    worldUsersById: worldUsersById ?? noUsersById,
    isWorldUsersLoaded: isLoaded(worldUsersById),
  };
};

// @debt typing, this uses Partial<Record<K,T>> to work around the bug where Record implies that a User will exist for literally any given string, which is untrue
// @debt refactor all usages of Record<string, User> to Partial<Record<string, User>> (then we can remove this workaround)
export const useWorldUsersByIdWorkaround = () => {
  const {
    worldUsersById: _worldUsersById,
    isWorldUsersLoaded,
  } = useWorldUsersById();

  const worldUsersById: Partial<Record<string, User>> = _worldUsersById;

  return { worldUsersById, isWorldUsersLoaded };
};
