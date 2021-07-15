import React from "react";

import { useVenueId } from "hooks/useVenueId";
import {
  AdministeredVenuesProvider,
  AdministeredVenuesProviderProps,
} from "hooks/useConnectAdministeredVenues";
import { WorldUsersProvider, WorldUsersProviderProps } from "hooks/users";
import {
  RelatedVenuesProvider,
  RelatedVenuesProviderProps,
} from "hooks/useRelatedVenues";
import { useUser } from "hooks/useUser";

export type EmptyProviderProps = Partial<
  AdministeredVenuesProviderProps &
    RelatedVenuesProviderProps &
    WorldUsersProviderProps
>;

const EmptyProvider: React.FC<EmptyProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export interface ProvidedProps {
  withAdministeredVenues?: boolean;
  withRelatedVenues?: boolean;
  withWorldUsers?: boolean;
}

export const Provided: React.FC<ProvidedProps> = ({
  children,
  withAdministeredVenues = false,
  withRelatedVenues = false,
  withWorldUsers = false,
}) => {
  const { userId } = useUser();
  const venueId = useVenueId();

  const MaybeAdministeredVenuesProvider: React.FC<AdministeredVenuesProviderProps> = withAdministeredVenues
    ? AdministeredVenuesProvider
    : EmptyProvider;

  const MaybeRelatedVenuesProvider: React.FC<RelatedVenuesProviderProps> = withRelatedVenues
    ? RelatedVenuesProvider
    : EmptyProvider;

  const MaybeWorldUsersProvider: React.FC<WorldUsersProviderProps> = withWorldUsers
    ? WorldUsersProvider
    : EmptyProvider;

  return (
    <MaybeWorldUsersProvider venueId={venueId}>
      <MaybeRelatedVenuesProvider venueId={venueId}>
        <MaybeAdministeredVenuesProvider userId={userId}>
          {children}
        </MaybeAdministeredVenuesProvider>
      </MaybeRelatedVenuesProvider>
    </MaybeWorldUsersProvider>
  );
};
