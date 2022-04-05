import React from "react";
import { NotFound } from "components/shared/NotFound";

import { useUserId } from "hooks/user/useUserId";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { LoadingPage } from "components/molecules/LoadingPage";

import { SpacesDashboard } from "./SpacesDashboard";

export const SpacesDashboardHoc: React.FC = () => {
  const { worldSlug } = useWorldParams();
  const { world, isLoading: isWorldLoading } = useWorldBySlug(worldSlug);
  const { userId, isLoading: isUserLoading } = useUserId();

  if (isUserLoading || isWorldLoading) {
    return <LoadingPage />;
  }

  if (!world) {
    return <NotFound />;
  }

  return <SpacesDashboard userId={userId} world={world} />;
};
