import React, { useEffect } from "react";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

import { updateTheme } from "pages/VenuePage/helpers";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFound } from "components/atoms/NotFound";

import VenueLandingPageContent from "./VenueLandingPageContent";

import "./VenueLandingPage.scss";

export const VenueLandingPage: React.FC = () => {
  const { worldSlug, spaceSlug } = useSpaceParams();

  const { space, world, isLoaded } = useWorldAndSpaceBySlug(
    worldSlug,
    spaceSlug
  );

  const redirectUrl = space?.config?.redirectUrl ?? "";
  const { hostname } = window.location;

  useEffect(() => {
    if (redirectUrl && redirectUrl !== hostname) {
      window.location.hostname = redirectUrl;
    }
  }, [hostname, redirectUrl]);

  useEffect(() => {
    if (!space) return;

    // @debt replace this with useCss?
    updateTheme(space);
  }, [space]);

  if (!isLoaded) {
    return <LoadingPage />;
  }

  if (!space || !world) {
    return (
      <WithNavigationBar hasBackButton withHiddenLoginButton>
        <NotFound />
      </WithNavigationBar>
    );
  }

  return (
    <WithNavigationBar hasBackButton withSchedule>
      <VenueLandingPageContent venue={space} world={world} />
    </WithNavigationBar>
  );
};
