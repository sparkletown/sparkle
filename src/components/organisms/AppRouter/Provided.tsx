import React from "react";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";
import { useVenueId } from "hooks/useVenueId";

export interface ProvidedProps {
  withRelatedVenues?: boolean;
}

export const Provided: React.FC<ProvidedProps> = ({
  children,
  withRelatedVenues = false,
}) => {
  const venueId = useVenueId();

  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  if (!withRelatedVenues) return <>{children}</>;

  return (
    <RelatedVenuesProvider venueId={venueId} worldId={venue?.worldId}>
      {children}
    </RelatedVenuesProvider>
  );
};
