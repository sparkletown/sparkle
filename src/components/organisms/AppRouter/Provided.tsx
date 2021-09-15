import React from "react";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import {
  RelatedVenuesProvider,
  RelatedVenuesProviderProps,
} from "hooks/useRelatedVenues";
import { WorldUsersProvider, WorldUsersProviderProps } from "hooks/users";
import { useVenueId } from "hooks/useVenueId";

export type EmptyProviderProps = Partial<
  RelatedVenuesProviderProps & WorldUsersProviderProps
>;

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

  const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  const MaybeRelatedVenuesProvider: React.FC<RelatedVenuesProviderProps> = withRelatedVenues
    ? RelatedVenuesProvider
    : EmptyProvider;

  const MaybeWorldUsersProvider: React.FC<WorldUsersProviderProps> = withWorldUsers
    ? WorldUsersProvider
    : EmptyProvider;

  return (
    <MaybeRelatedVenuesProvider venue={venue}>
      <MaybeWorldUsersProvider venueId={venueId}>
        {children}
      </MaybeWorldUsersProvider>
    </MaybeRelatedVenuesProvider>
  );
};
