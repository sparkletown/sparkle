import React, { useEffect, useMemo } from "react";

import { venueEventsSelector } from "utils/selectors";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import { updateTheme } from "pages/VenuePage/helpers";

import WithNavigationBar from "components/organisms/WithNavigationBar";

import { LoadingPage } from "components/molecules/LoadingPage";

import VenueLandingPageContent from "./VenueLandingPageContent";

import "./VenueLandingPage.scss";

export const VenueLandingPage: React.FC = () => {
  const venueId = useVenueId() || "";

  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);
  const venueRequestStatus = useSelector(
    (state) => state.firestore.status.requested.currentVenue
  );
  const { descendantVenues, sovereignVenueId } = useRelatedVenues({
    currentVenueId: venueId,
  });

  const venueEvents = useSelector(venueEventsSelector);
  const allVenueEvents = useMemo(
    () => [
      ...(venueEvents || []),
      ...(sovereignVenueId === venueId
        ? [...descendantVenues.flatMap((venue) => venue.events || [])]
        : []),
    ],
    [descendantVenues, venueEvents, sovereignVenueId, venueId]
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
    return <>This venue does not exist</>;
  }

  if (!venue) {
    return <LoadingPage />;
  }

  return (
    <WithNavigationBar>
      <VenueLandingPageContent venue={venue} venueEvents={allVenueEvents} />
    </WithNavigationBar>
  );
};
