import React, { useEffect } from "react";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/useSpaceParams";

import { updateTheme } from "pages/VenuePage/helpers";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFound } from "components/atoms/NotFound";

import VenueLandingPageContent from "./VenueLandingPageContent";

import "./VenueLandingPage.scss";

export const VenueLandingPage: React.FC = () => {
  const spaceSlug = useSpaceParams();

  const { space, isLoaded } = useSpaceBySlug(spaceSlug);

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

  if (!space) {
    return (
      <WithNavigationBar hasBackButton withHiddenLoginButton>
        <NotFound />
      </WithNavigationBar>
    );
  }

  return (
    <WithNavigationBar hasBackButton withSchedule>
      <VenueLandingPageContent venue={space} />
    </WithNavigationBar>
  );
};
