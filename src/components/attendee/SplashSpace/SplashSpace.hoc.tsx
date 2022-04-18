import React from "react";
import { NotFound } from "components/shared/NotFound";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { SplashSpace } from "./SplashSpace";

export const SplashSpaceHoc: React.FC = () => {
  const { space, isLoading } = useWorldAndSpaceByParams();

  if (isLoading) {
    // TODO: re-check if <LoadingPage /> might be more suitable than null
    return null;
  }

  if (!space) {
    return <NotFound />;
  }

  return <SplashSpace space={space} />;
};
