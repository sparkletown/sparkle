import { where } from "firebase/firestore";

import { COLLECTION_ROLES } from "settings";

import { convertToFirestoreKey } from "utils/id";

import { useRefiCollection } from "hooks/fire/useRefiCollection";
import { useLoginCheck } from "hooks/user/useLoginCheck";

export const useRoles = () => {
  const { userId, isLoading: isUserLoading } = useLoginCheck();

  const {
    data: userRolesData,
    isLoaded: isUserRolesLoaded,
  } = useRefiCollection({
    path: [COLLECTION_ROLES],
    constraints: [
      where("users", "array-contains", convertToFirestoreKey(userId)),
    ],
  });

  const {
    data: allowAllRolesData,
    isLoaded: isAllowAllRolesLoaded,
  } = useRefiCollection({
    path: [COLLECTION_ROLES],
    constraints: [where("allowAll", "==", true)],
  });

  const rolesForUser = userRolesData ? Object.keys(userRolesData) : [];
  const rolesForAll = allowAllRolesData ? Object.keys(allowAllRolesData) : [];
  const rolesCombined = [...rolesForUser, ...rolesForAll];

  return {
    isUserRolesLoaded: !isUserLoading && isUserRolesLoaded,
    isAllowAllRolesLoaded: !isUserLoading && isAllowAllRolesLoaded,
    isRolesLoaded: !isUserLoading && isUserRolesLoaded && isAllowAllRolesLoaded,
    userRoles: rolesForUser,
    allowAllRoles: rolesForAll,
    roles: rolesCombined,
  };
};
