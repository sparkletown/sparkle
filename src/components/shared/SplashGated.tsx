import React, { ReactNode } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";

import { SpaceSlugLocation } from "types/id";

import { useLiveUser } from "hooks/user/useLiveUser";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

import { Loading } from "components/molecules/Loading";
import { LoadingPage } from "components/molecules/LoadingPage";

import { OnboardingGated } from "./OnboardingGated";

interface SplashGatedProps {
  loading?: "spinner" | "page" | ReactNode;
}

/**
 * This is a simple check and "redirect" component, no styles, just logic
 */
export const SplashGated: React.FC<SplashGatedProps> = ({
  loading = null,
  children,
}) => {
  const { userId, isLoading: isUserLoading } = useLiveUser();

  const {
    worldSlug: worldSlugFromParams,
    spaceSlug: spaceSlugFromParams,
  } = useParams<Partial<SpaceSlugLocation>>();

  const { worldId, isLoading: isWorldLoading } = useWorldBySlug(
    worldSlugFromParams
  );
  const isLoading = isWorldLoading || isUserLoading;

  const history = useHistory();

  if (isLoading) {
    if (loading === "spinner") return <Loading />;
    if (loading === "page") return <LoadingPage />;
    return <>{loading}</>;
  }

  if (!userId) {
    return <Redirect to={`${history.location.pathname}/splash`} />;
  }

  if (!worldId || !worldSlugFromParams || !spaceSlugFromParams) {
    return <div>Error</div>;
  }

  return (
    <OnboardingGated
      worldId={worldId}
      worldSlug={worldSlugFromParams}
      spaceSlug={spaceSlugFromParams}
      userId={userId}
    >
      {children}
    </OnboardingGated>
  );
};
