import { isEqual, mapValues } from "lodash";

import { User, userWithLocationToUser } from "types/User";

import { withId, WithId } from "utils/id";
// import { worldUsersByIdWithoutLocationSelector } from "utils/selectors";

// import { isLoaded } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

// import { useWorldUsersContext } from "./useWorldUsers";

const noUsersById: Record<string, WithId<User>> = {};

/**
 * @debt typing, Record implies that a User will exist for literally any given string, which is untrue
 * @deprecated use useWorldUsersByIdWorkaround until we refactor this to fix the typing issue across the codebase
 */
export const useWorldUsersById = () => {
  // We mostly use this here to ensure that the WorldUsersProvider has definitely been connected
  // useWorldUsersContext();

  // const worldUsersById = useSelector(
  //   (state) => state.cache.usersRecord,
  //   isEqual
  // );

  const selectedWorldUsers = useSelector((state) => {
    const worldUsersById = state.cache.usersRecord;

    return mapValues(worldUsersById, (user, userId) =>
      userWithLocationToUser(withId(user, userId))
    );
  }, isEqual);

  // const worldUsersById: Record<string, WithId<User>> | undefined = useSelector(
  //   worldUsersByIdWithoutLocationSelector,
  //   isEqual
  // );

  return {
    worldUsersById: selectedWorldUsers ?? noUsersById,
    isWorldUsersLoaded: true,
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
