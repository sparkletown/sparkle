import React, { useCallback } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";

import { EntranceStepTemplate } from "types/EntranceStep";

import { isCompleteProfile } from "utils/profile";
import {
  accountProfileVenueUrl,
  venueEntranceUrl,
  venueInsideUrl,
} from "utils/url";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { useWorldEdit } from "hooks/useWorldEdit";

import Login from "pages/Account/Login";
import { WelcomeVideo } from "pages/entrance/WelcomeVideo";

import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

import { NotFound } from "components/atoms/NotFound";

export const VenueEntrancePage: React.FunctionComponent<{}> = () => {
  const history = useHistory();
  const venueId = useVenueId();
  const { user, profile } = useUser();
  const { step: unparsedStep } = useParams<{ step?: string }>();

  const { currentVenue, isCurrentVenueLoaded } = useConnectCurrentVenueNG(
    venueId
  );
  const { world, isLoaded: isWorldLoaded } = useWorldEdit(
    currentVenue?.worldId
  );
  const parsedStep = Number.parseInt(unparsedStep ?? "", 10);

  const proceed = useCallback(
    () => venueId && history.push(venueEntranceUrl(venueId, parsedStep + 1)),
    [venueId, parsedStep, history]
  );

  if (!isCurrentVenueLoaded || !isWorldLoaded) {
    return <LoadingPage />;
  }

  if (!venueId || !currentVenue) {
    return <NotFound />;
  }

  if (
    !Number.isSafeInteger(parsedStep) ||
    parsedStep <= 0 ||
    (world?.entrance?.length ?? 0) < parsedStep
  ) {
    return <Redirect to={venueInsideUrl(venueId)} />;
  }

  if (!user || !profile) {
    return <Login venueId={venueId} />;
  }

  if (profile && !isCompleteProfile(profile)) {
    return <Redirect to={accountProfileVenueUrl(venueId)} />;
  }

  const stepConfig = world?.entrance?.[parsedStep - 1];
  if (stepConfig?.template !== EntranceStepTemplate.WelcomeVideo) {
    return null;
  }

  return (
    <WelcomeVideo
      venueName={currentVenue.name}
      config={stepConfig}
      proceed={proceed}
    />
  );
};
