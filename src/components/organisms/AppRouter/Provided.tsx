import React from "react";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import {
  RelatedVenuesProvider,
  RelatedVenuesProviderProps,
} from "hooks/useRelatedVenues";
import { WorldUsersProvider, WorldUsersProviderProps } from "hooks/users";
import { useVenueId } from "hooks/useVenueId";

import { LoadingPage } from "components/molecules/LoadingPage";

export type EmptyProviderProps = RelatedVenuesProviderProps &
  WorldUsersProviderProps;

const EmptyProvider: React.FC<EmptyProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export interface ProvidedProps {
  withRelatedVenues?: boolean;
  withWorldUsers?: boolean;
}

export const Provided: React.FC<ProvidedProps> = ({
  children,
  withRelatedVenues = false,
  withWorldUsers = false,
}) => {
  const venueId = useVenueId();

  const {
    currentVenue: venue,
    isCurrentVenueLoaded,
  } = useConnectCurrentVenueNG(venueId);

  const MaybeRelatedVenuesProvider: React.FC<RelatedVenuesProviderProps> = withRelatedVenues
    ? RelatedVenuesProvider
    : EmptyProvider;

  const MaybeWorldUsersProvider: React.FC<WorldUsersProviderProps> = withWorldUsers
    ? WorldUsersProvider
    : EmptyProvider;

  if (!isCurrentVenueLoaded) return <LoadingPage />;

  if (!venue?.worldId) {
    console.error("Venue worldId is missing in the current venue object");
    return null;
  }

  return (
    <MaybeRelatedVenuesProvider venueId={venueId} worldId={venue.worldId}>
      <MaybeWorldUsersProvider venueId={venueId} worldId={venue.worldId}>
        {children}
      </MaybeWorldUsersProvider>
    </MaybeRelatedVenuesProvider>
  );
};
