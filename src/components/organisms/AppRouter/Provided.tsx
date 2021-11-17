import React from "react";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";
import { useSpaceParams } from "hooks/useVenueId";

export interface ProvidedProps {
  withRelatedVenues?: boolean;
}

export const Provided: React.FC<ProvidedProps> = ({
  children,
  withRelatedVenues = false,
}) => {
  const spaceSlug = useSpaceParams();
  const { space } = useSpaceBySlug(spaceSlug);
  const venueId = space?.id;

  if (!withRelatedVenues) return <>{children}</>;

  return (
    <RelatedVenuesProvider venueId={venueId} worldId={space?.worldId}>
      {children}
    </RelatedVenuesProvider>
  );
};
