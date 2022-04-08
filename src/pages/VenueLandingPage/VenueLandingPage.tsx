import React, { useEffect } from "react";
import { NotFound } from "components/shared/NotFound";

import {
  SpaceWithId,
  UserId,
  WorldAndSpaceIdLocation,
  WorldAndSpaceSlugLocation,
  WorldWithId,
} from "types/id";

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

  return space && world ? <VenueLandingPageContent {...props} /> : <NotFound />;
};
