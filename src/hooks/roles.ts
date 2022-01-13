import { useRefiDocument } from "hooks/reactfire/useRefiDocument";

export type AdminRole = {
  allowAll: boolean;
  users: string[];
};

export const useAdminRole = () => {
  const { data, isLoading } = useRefiDocument<AdminRole>("roles", "admin");

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
