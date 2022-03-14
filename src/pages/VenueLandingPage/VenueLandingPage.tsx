import React, { useEffect } from "react";

import {
  SpaceWithId,
  UserId,
  WorldAndSpaceIdLocation,
  WorldAndSpaceSlugLocation,
  WorldWithId,
} from "types/id";

import { WithNavigationBar } from "components/organisms/WithNavigationBar";

import { NotFound } from "components/atoms/NotFound";

import { VenueLandingPageContent } from "./VenueLandingPageContent";

import "./VenueLandingPage.scss";

export type VenueLandingPageProps = WorldAndSpaceIdLocation &
  WorldAndSpaceSlugLocation & {
    userId: UserId;
    space: SpaceWithId;
    world: WorldWithId;
  };

export const VenueLandingPage: React.FC<VenueLandingPageProps> = (props) => {
  const { space, world } = props;
  const redirectUrl = space?.config?.redirectUrl ?? "";
  const { hostname } = window.location;

  useEffect(() => {
    if (redirectUrl && redirectUrl !== hostname) {
      window.location.hostname = redirectUrl;
    }
  }, [hostname, redirectUrl]);

  return space && world ? (
    <WithNavigationBar hasBackButton withSchedule>
      <VenueLandingPageContent {...props} />
    </WithNavigationBar>
  ) : (
    <WithNavigationBar hasBackButton withHiddenLoginButton>
      <NotFound />
    </WithNavigationBar>
  );
};
