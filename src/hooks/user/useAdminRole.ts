import { isNil } from "lodash/fp";

import { ALWAYS_EMPTY_ARRAY, COLLECTION_ROLES } from "settings";

import { LoadStatus } from "types/fire";

import { WithId } from "utils/id";

import { useRefiDocument } from "hooks/fire/useRefiDocument";

export type AdminRole = {
  allowAll: boolean;
  users: string[];
};

export type UseAdminRole = (options: {
  userId?: string;
}) => LoadStatus & {
  adminRole: WithId<AdminRole>;
  adminUserIds: string[];
  isAdminUser: boolean;
  isNotAdminUser: boolean;
};

export const useAdminRole: UseAdminRole = ({ userId }) => {
  const { data: adminRole, isLoading, error } = useRefiDocument<AdminRole>([
    COLLECTION_ROLES,
    "admin",
  ]);

  const adminUserIds =
    !isLoading && adminRole?.users ? adminRole.users : ALWAYS_EMPTY_ARRAY;

  const isAdminUser = !isNil(userId) && adminUserIds.includes(userId);

  return {
    adminRole,
    adminUserIds,
    isAdminUser,
    isNotAdminUser: !isAdminUser,
    isLoading,
    isLoaded: !isLoading,
    error,
  };
};
