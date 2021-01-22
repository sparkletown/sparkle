import { isEmpty, isLoaded } from "react-redux-firebase";
import { SparkleSelector } from "types/SparkleSelector";
import { AnySparkleRFQuery, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";

export type AdminRole = {
  allowAll: boolean;
  users: string[];
};

export const adminRoleQuery: AnySparkleRFQuery = {
  collection: "roles",
  doc: "admin",
  storeAs: "adminRole",
};

export const adminRoleSelector: SparkleSelector<AdminRole | undefined> = (
  state
) => state.firestore.data.adminRole;

/**
 * React Hook to load and return adminRole data from Firestore/Redux.
 *
 * @see useFirestoreConnect
 * @see useSelector
 */
export const useAdminRole = () => {
  useFirestoreConnect(adminRoleQuery);
  const adminRole = useSelector(adminRoleSelector);
  return {
    adminRole,
    isLoading: !isLoaded(adminRole),
    isEmpty: isEmpty(adminRole),
  };
};

/**
 * React Hook to retrieved adminUserIds from Firestore/Redux.
 *
 * @see useAdminRole
 */
export const useAdminUserIds = () => {
  const { adminRole, isLoading, isEmpty } = useAdminRole();
  const adminUserIds =
    !isLoading && !isEmpty && adminRole?.users ? adminRole.users : [];
  return {
    adminUserIds,
    isLoading,
    isEmpty,
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
  const { adminUserIds, isLoading, isEmpty } = useAdminUserIds();
  const isAdminUser =
    userId === undefined ? false : adminUserIds.includes(userId);
  return {
    isAdminUser,
    isLoading,
    isEmpty,
  };
};
