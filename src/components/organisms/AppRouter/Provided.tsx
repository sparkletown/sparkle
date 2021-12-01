import React from "react";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

export interface ProvidedProps {
  withRelatedVenues?: boolean;
}

export const Provided: React.FC<ProvidedProps> = ({
  children,
  withRelatedVenues = false,
}) => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space, spaceId } = useSpaceBySlug(worldSlug, spaceSlug);

  if (!withRelatedVenues) return <>{children}</>;

  return (
    <RelatedVenuesProvider venueId={spaceId} worldId={space?.worldId}>
      {children}
    </RelatedVenuesProvider>
  );
};
