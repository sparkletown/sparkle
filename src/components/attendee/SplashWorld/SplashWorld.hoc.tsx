import React from "react";
import { NotFound } from "components/shared/NotFound";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { SplashWorld } from "./SplashWorld";

export const SplashWorldHoc: React.FC = () => {
  const { isLoading, world } = useWorldAndSpaceByParams();

  if (isLoading) {
    // TODO: re-check if <LoadingPage /> might be more suitable than null
    return null;
  }

  if (!world) {
    return <NotFound />;
  }

  return <SplashWorld world={world} />;
};
