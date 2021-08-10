import { isEqual } from "lodash";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";
import { useUser } from "./useUser";

export const useRoles = () => {
  const { user } = useUser();

  useFirestoreConnect(
    user
      ? {
          collection: "roles",
          where: [["users", "array-contains", user.uid]],
          storeAs: "userRoles",
        }
      : undefined
  );

  useFirestoreConnect({
    collection: "roles",
    where: [["allowAll", "==", true]],
    storeAs: "allowAllRoles",
  });

  const {
    isUserRolesLoaded,
    isAllowAllRolesLoaded,
    isRolesLoaded,
    userRoles,
    allowAllRoles,
    roles,
  } = useSelector((state) => {
    const { userRoles, allowAllRoles } = state.firestore.data;

    const rolesForUser = userRoles ? Object.keys(userRoles) : [];
    const rolesForAll = allowAllRoles ? Object.keys(allowAllRoles) : [];
    const combinedRoles = [...rolesForUser, ...rolesForAll];

    return {
      isUserRolesLoaded: isLoaded(userRoles),
      userRoles: rolesForUser,

      isAllowAllRolesLoaded: isLoaded(allowAllRoles),
      allowAllRoles: rolesForAll,

      isRolesLoaded: isLoaded(userRoles) && isLoaded(allowAllRoles),
      roles: combinedRoles,
    };
  }, isEqual);

  return {
    isUserRolesLoaded,
    isAllowAllRolesLoaded,
    isRolesLoaded,
    userRoles,
    allowAllRoles,
    roles,
  };
};
