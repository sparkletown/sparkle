import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useSelector } from "hooks/useSelector";
import { WelcomeVideo } from "pages/entrance/WelcomeVideo";
import React from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { EntranceStepTemplate } from "types/EntranceStep";
import { venueEntranceUrl, venueInsideUrl } from "utils/url";

export const VenueEntrancePage: React.FunctionComponent<{}> = () => {
  const history = useHistory();
  const { step, venueId } = useParams();
  useConnectCurrentVenue();
  const venue = useSelector((state) => state.firestore.data.currentVenue);
  if (!venue) {
    return <LoadingPage />;
  }

  if (
    !(parseInt(step) > 0) ||
    !venue.entrance ||
    !venue.entrance.length ||
    venue.entrance.length < parseInt(step)
  ) {
    return <Redirect to={venueInsideUrl(venueId)} />;
  }

  const proceed = () => {
    history.push(venueEntranceUrl(venueId, parseInt(step) + 1));
  };

  const stepConfig = venue.entrance[parseInt(step) - 1];
  switch (stepConfig.template) {
    case EntranceStepTemplate.WelcomeVideo:
      return <WelcomeVideo config={stepConfig} proceed={proceed} />;
  }
};
