import React from "react";

import { useUserId } from "hooks/user/useUserId";

import { LoadingPage } from "components/molecules/LoadingPage";

import { WorldsDashboard } from "./WorldsDashboard";

export const WorldsDashboardHoc: React.FC = () => {
  const { userId, isLoading } = useUserId();

  if (isLoading) {
    return <LoadingPage />;
  }

  return <WorldsDashboard userId={userId} />;
};
