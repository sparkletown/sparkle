import React from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";

import { EntranceStepTemplate } from "types/EntranceStep";

import { isCompleteProfile } from "utils/profile";
import { currentVenueSelector } from "utils/selectors";
import { venueEntranceUrl, venueInsideUrl } from "utils/url";

import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import Login from "pages/Account/Login";
import { WelcomeVideo } from "pages/entrance/WelcomeVideo";

import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

export const VenueEntrancePage: React.FunctionComponent<{}> = () => {
  const { user, profile } = useUser();
  const history = useHistory();
  const { step: unparsedStep } = useParams<{ step?: string }>();
  const venueId = useVenueId();

  useConnectCurrentVenue();
  const venue = useSelector(currentVenueSelector);
  const parsedStep = Number.parseInt(unparsedStep ?? "", 10);

  if (!venue || !venueId) {
    return <LoadingPage />;
  }

  if (
    unparsedStep === undefined ||
    !(parsedStep > 0) ||
    !venue.entrance ||
    !venue.entrance.length ||
    venue.entrance.length < parsedStep
  ) {
    return <Redirect to={venueInsideUrl(venueId)} />;
  }

  if (!user || !profile) {
    return <Login venueId={venueId} />;
  }

  if (profile && !isCompleteProfile(profile)) {
    return <Redirect to={`/account/profile?venueId=${venueId}`} />;
  }

  const proceed = () => {
    history.push(venueEntranceUrl(venueId, parsedStep + 1));
  };

  const stepConfig = venue.entrance[parsedStep - 1];
  switch (stepConfig.template) {
    case EntranceStepTemplate.WelcomeVideo:
      return (
        <WelcomeVideo
          venueName={venue.name}
          config={stepConfig}
          proceed={proceed}
        />
      );
  }
};
