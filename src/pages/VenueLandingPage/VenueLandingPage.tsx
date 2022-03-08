import React, { useEffect } from "react";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useUserId } from "hooks/user/useUserId";

import { WithNavigationBar } from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFound } from "components/atoms/NotFound";

import { VenueLandingPageContent } from "./VenueLandingPageContent";

import "./VenueLandingPage.scss";

export const VenueLandingPage: React.FC = () => {
  const { userId, isLoading: isUserLoading } = useUserId();
  const {
    world,
    space,
    isLoading: isWorldLoading,
    spaceSlug,
    worldSlug,
  } = useWorldAndSpaceByParams();
  const redirectUrl = space?.config?.redirectUrl ?? "";
  const { hostname } = window.location;

  useEffect(() => {
    if (redirectUrl && redirectUrl !== hostname) {
      window.location.hostname = redirectUrl;
    }
  }, [hostname, redirectUrl]);

  if (isWorldLoading || isUserLoading) {
    return <LoadingPage />;
  }

  return space && world ? (
    <WithNavigationBar hasBackButton withSchedule>
      <VenueLandingPageContent
        userId={userId}
        world={world}
        worldSlug={worldSlug}
        worldId={world.id}
        space={space}
        spaceId={space.id}
        spaceSlug={spaceSlug}
      />
    </WithNavigationBar>
  ) : (
    <WithNavigationBar hasBackButton withHiddenLoginButton>
      <NotFound />
    </WithNavigationBar>
  );
};
