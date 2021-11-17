import React from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";

import { EntranceStepTemplate } from "types/EntranceStep";

import { isCompleteProfile } from "utils/profile";
import {
  accountProfileVenueUrl,
  venueEntranceUrl,
  venueInsideUrl,
} from "utils/url";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useCurrentWorld } from "hooks/useCurrentWorld";
import { useUser } from "hooks/useUser";
import { useSpaceParams } from "hooks/useVenueId";

import Login from "pages/Account/Login";
import { WelcomeVideo } from "pages/entrance/WelcomeVideo";

import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

export const VenueEntrancePage: React.FunctionComponent<{}> = () => {
  const { user, profile } = useUser();
  const history = useHistory();
  const { step: unparsedStep } = useParams<{ step?: string }>();

  const spaceSlug = useSpaceParams();
  const { space } = useSpaceBySlug(spaceSlug);
  const venueId = space?.id;

  const { world } = useCurrentWorld({ worldId: space?.worldId });

  useConnectCurrentVenue();
  const parsedStep = Number.parseInt(unparsedStep ?? "", 10);

  if (!space || !venueId) {
    return <LoadingPage />;
  }

  if (
    unparsedStep === undefined ||
    !(parsedStep > 0) ||
    !world?.entrance ||
    !world?.entrance.length ||
    world?.entrance.length < parsedStep
  ) {
    return <Redirect to={venueInsideUrl(venueId)} />;
  }

  if (!user || !profile) {
    return <Login venueId={venueId} />;
  }

  if (profile && !isCompleteProfile(profile)) {
    return <Redirect to={accountProfileVenueUrl(venueId)} />;
  }

  const proceed = () => {
    history.push(venueEntranceUrl(venueId, parsedStep + 1));
  };

  const stepConfig = world.entrance[parsedStep - 1];
  switch (stepConfig.template) {
    case EntranceStepTemplate.WelcomeVideo:
      return (
        <WelcomeVideo
          venueName={space.name}
          config={stepConfig}
          proceed={proceed}
        />
      );
  }
};
