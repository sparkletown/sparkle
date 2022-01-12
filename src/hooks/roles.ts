import { useFirestore, useFirestoreDocData } from "reactfire";
import { doc } from "firebase/firestore";

export type AdminRole = {
  allowAll: boolean;
  users: string[];
};

/**
 * React Hook to load and return adminRole data from Firestore/Redux.
 *
 * @see useFirestoreConnect
 * @see useSelector
 */
export const useAdminRole = () => {
  const firestore = useFirestore();
  const query = doc(firestore, "roles", "admin");

  const { data, status } = useFirestoreDocData(query);

  return {
    adminRole: data as AdminRole,
    isLoading: status === "loading",
  };
};

/**
 * React Hook to retrieved adminUserIds from Firestore/Redux.
 *
 * @see useAdminRole
 */
export const useAdminUserIds = () => {
  const { adminRole, isLoading } = useAdminRole();
  const adminUserIds = !isLoading && adminRole?.users ? adminRole.users : [];
  return {
    adminUserIds,
    isLoading,
  };
};

/**
 * React Hook to check if the supplied userId is an Admin within Firestore/Redux.
 *
 * @param userId the userId to be checked
 *
 * @see useAdminUserIds
 */
export const useIsAdminUser = (userId?: string) => {
  const { adminUserIds, isLoading } = useAdminUserIds();
  console.log("admin user", adminUserIds, isLoading);
  const isAdminUser =
    userId === undefined ? false : adminUserIds.includes(userId);
  return {
    isAdminUser,
    isLoading,
  };
};
