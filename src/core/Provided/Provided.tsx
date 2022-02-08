import React from "react";

import { SpaceId, WorldId } from "types/id";

import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

export interface ProvidedProps {
  spaceId?: SpaceId;
  withRelatedVenues?: boolean;
  worldId?: WorldId;
}

export const Provided: React.FC<ProvidedProps> = ({
  children,
  withRelatedVenues = false,
  worldId,
  spaceId,
}) => {
  return withRelatedVenues ? (
    <RelatedVenuesProvider spaceId={spaceId} worldId={worldId}>
      {children}
    </RelatedVenuesProvider>
  ) : (
    <>{children}</>
  );
};
