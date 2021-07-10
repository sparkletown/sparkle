import React from "react";

import { useVenueId } from "hooks/useVenueId";
import { WorldUsersProvider } from "hooks/users";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

export interface ProvidedProps {
  withWorldUsers?: boolean;
  withRelatedVenues?: boolean;
}

export const Provided: React.FC<ProvidedProps> = ({
  withWorldUsers = false,
  withRelatedVenues = false,
  children,
}) => {
  const venueId = useVenueId();

  if (withWorldUsers && withRelatedVenues) {
    return (
      <WorldUsersProvider venueId={venueId}>
        <RelatedVenuesProvider venueId={venueId}>
          {children}
        </RelatedVenuesProvider>
      </WorldUsersProvider>
    );
  }

  if (withWorldUsers) {
    return (
      <WorldUsersProvider venueId={venueId}>{children}</WorldUsersProvider>
    );
  }

  if (withRelatedVenues) {
    return (
      <RelatedVenuesProvider venueId={venueId}>
        {children}
      </RelatedVenuesProvider>
    );
  }

  return <>{children}</>;
};
