import React from "react";

import { useIsAdminUser } from "hooks/roles";

export interface AdminForbiddenProps {
  userId: string;
}

export const AdminForbidden: React.FC<AdminForbiddenProps> = ({ userId }) => {
  const { isAdminUser, isLoading } = useIsAdminUser(userId);

  if (isAdminUser) {
    return null;
  }

  if (isLoading) return <>Loading...</>;

  return <>This administration tool is forbidden to you</>;
};
