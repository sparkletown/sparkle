import React from "react";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";
import { useVenueId } from "hooks/useVenueId";

import { LoadingPage } from "components/molecules/LoadingPage";

export interface ProvidedProps {
  withRelatedVenues?: boolean;
}

export const Provided: React.FC<ProvidedProps> = ({
  children,
  withRelatedVenues = false,
}) => {
  const venueId = useVenueId();

  const {
    currentVenue: venue,
    isCurrentVenueLoaded,
  } = useConnectCurrentVenueNG(venueId);

  if (!withRelatedVenues) return <>{children}</>;

  if (!isCurrentVenueLoaded) return <LoadingPage />;

  if (!venue?.worldId) {
    console.error("Venue worldId is missing in the current venue object");
    return null;
  }

  return (
    <RelatedVenuesProvider venueId={venueId} worldId={venue.worldId}>
      {children}
    </RelatedVenuesProvider>
  );
};
