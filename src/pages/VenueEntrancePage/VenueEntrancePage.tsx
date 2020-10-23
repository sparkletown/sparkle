import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";
import AuthenticationModal from "components/organisms/AuthenticationModal";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { WelcomeVideo } from "pages/entrance/WelcomeVideo";
import React from "react";
import { useFirebase } from "react-redux-firebase";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { EntranceStepTemplate } from "types/EntranceStep";
import { venueEntranceUrl, venueInsideUrl } from "utils/url";

export const VenueEntrancePage: React.FunctionComponent<{}> = () => {
  const { user, profile } = useUser();
  const firebase = useFirebase();
  const history = useHistory();
  const { step, venueId } = useParams();
  useConnectCurrentVenue();
  const venue = useSelector((state) => state.firestore.data.currentVenue);

  if (!venue || !venueId) {
    return <LoadingPage />;
  }

  if (!user || !profile) {
    return (
      <WithNavigationBar>
        <AuthenticationModal
          show={true}
          onHide={() => {}}
          showAuth="register"
        />
      </WithNavigationBar>
    );
  }

  if (
    !(parseInt(step) > 0) ||
    !venue.entrance ||
    !venue.entrance.length ||
    venue.entrance.length < parseInt(step)
  ) {
    const enteredVenueIds = profile.enteredVenueIds ?? [];
    if (!enteredVenueIds.includes(venueId)) {
      enteredVenueIds.push(venueId);
      (async () =>
        await firebase.firestore().collection("users").doc(user.uid).update({
          enteredVenueIds,
        }))();
    }
    return <Redirect to={venueInsideUrl(venueId)} />;
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
