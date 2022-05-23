import React from "react";
import { NotFound } from "components/shared/NotFound";

import { useUser } from "hooks/user/useUser";

import { AccountPage } from "./AccountPage";

export const AccountPageHoc: React.FC = () => {
  const { userWithId, isLoading } = useUser();

  if (isLoading) {
    // TODO: re-check if <LoadingPage /> might be more suitable than null
    return null;
  }

  if (!userWithId) {
    return <NotFound />;
  }

  return <AccountPage user={userWithId} />;
};
