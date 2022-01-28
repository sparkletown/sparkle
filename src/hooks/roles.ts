import { COLLECTION_ROLES } from "settings";

import { useRefiDocument } from "hooks/fire/useRefiDocument";

export type AdminRole = {
  allowAll: boolean;
  users: string[];
};

export const useAdminRole = () => {
  const { data, isLoading } = useRefiDocument<AdminRole>([
    COLLECTION_ROLES,
    "admin",
  ]);

  return {
    adminRole: data,
    isLoading,
  };
};

export const useAdminUserIds = () => {
  const { adminRole, isLoading } = useAdminRole();
  const adminUserIds = !isLoading && adminRole?.users ? adminRole.users : [];
  return {
    adminUserIds,
    isLoading,
  };
};

export const useIsAdminUser = (userId?: string) => {
  const { adminUserIds, isLoading } = useAdminUserIds();
  const isAdminUser =
    userId === undefined ? false : adminUserIds.includes(userId);
  return {
    isAdminUser,
    isLoading,
  };
};
