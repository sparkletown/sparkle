import React from "react";

import { useVenueId } from "hooks/useVenueId";
import { WorldUsersProvider, WorldUsersProviderProps } from "hooks/users";
import {
  RelatedVenuesProvider,
  RelatedVenuesProviderProps,
} from "hooks/useRelatedVenues";

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

  const MaybeWorldUsersProvider: React.FC<WorldUsersProviderProps> = withWorldUsers
    ? WorldUsersProvider
    : React.Fragment;

  const MaybeRelatedVenuesProvider: React.FC<RelatedVenuesProviderProps> = withRelatedVenues
    ? RelatedVenuesProvider
    : React.Fragment;

  return (
    <MaybeWorldUsersProvider venueId={venueId}>
      <MaybeRelatedVenuesProvider venueId={venueId}>
        {children}
      </MaybeRelatedVenuesProvider>
    </MaybeWorldUsersProvider>
  );
};
