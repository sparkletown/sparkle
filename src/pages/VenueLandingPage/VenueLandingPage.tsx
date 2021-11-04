import React, { useEffect } from "react";

import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import { updateTheme } from "pages/VenuePage/helpers";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFound } from "components/atoms/NotFound";

import VenueLandingPageContent from "./VenueLandingPageContent";

import "./VenueLandingPage.scss";

export const VenueLandingPage: React.FC = () => {
  useConnectCurrentVenue();
  const venueId = useVenueId() || "";

  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);
  const venueRequestStatus = useSelector(
    (state) => state.firestore.status.requested.currentVenue
  );
  const redirectUrl = venue?.config?.redirectUrl ?? "";
  const { hostname } = window.location;

  useEffect(() => {
    if (redirectUrl && redirectUrl !== hostname) {
      window.location.hostname = redirectUrl;
    }
  }, [hostname, redirectUrl]);

  useEffect(() => {
    if (!venue) return;

    // @debt replace this with useCss?
    updateTheme(venue);
  }, [venue]);

  if (venueRequestStatus && !venue) {
    return (
      <WithNavigationBar hasBackButton hideLoginButton>
        <NotFound />
      </WithNavigationBar>
    );
  }

  if (!venue) {
    return <LoadingPage />;
  }

  return (
    <WithNavigationBar hasBackButton withSchedule>
      <VenueLandingPageContent venue={venue} />
    </WithNavigationBar>
  );
};
