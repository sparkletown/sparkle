import React from "react";

import { useVenueId } from "hooks/useVenueId";
import { WorldUsersProvider, WorldUsersProviderProps } from "hooks/users";
import {
  RelatedVenuesProvider,
  RelatedVenuesProviderProps,
} from "hooks/useRelatedVenues";

interface EmptyProviderProps {
  venueId?: string;
}

const EmptyProvider: React.FC<EmptyProviderProps> = ({ children }) => {
  return <>{children}</>;
};

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
    : EmptyProvider;

  const MaybeRelatedVenuesProvider: React.FC<RelatedVenuesProviderProps> = withRelatedVenues
    ? RelatedVenuesProvider
    : EmptyProvider;

  return (
    <MaybeWorldUsersProvider venueId={venueId}>
      <MaybeRelatedVenuesProvider venueId={venueId}>
        {children}
      </MaybeRelatedVenuesProvider>
    </MaybeWorldUsersProvider>
  );
};
