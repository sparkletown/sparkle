import React from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";

import { EntranceStepTemplate } from "types/EntranceStep";

import { withId } from "utils/id";
import { isCompleteProfile } from "utils/profile";
import { currentVenueSelectorData } from "utils/selectors";
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
  const { step } = useParams<{ step?: string }>();
  const venueId = useVenueId();
  useConnectCurrentVenue();
  const venue = useSelector(currentVenueSelectorData);

  if (!venue || !venueId) {
    return <LoadingPage />;
  }

  if (
    step === undefined ||
    !(parseInt(step) > 0) ||
    !venue.entrance ||
    !venue.entrance.length ||
    venue.entrance.length < parseInt(step)
  ) {
    return <Redirect to={venueInsideUrl(venueId)} />;
  }

  if (!user || !profile) {
    return <Login venue={withId(venue, venueId)} />;
  }

  if (profile && !isCompleteProfile(profile)) {
    history.push(`/account/profile?venueId=${venueId}`);
  }

  const proceed = () => {
    history.push(venueEntranceUrl(venueId, parseInt(step) + 1));
  };

  const stepConfig = venue.entrance[parseInt(step) - 1];
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
