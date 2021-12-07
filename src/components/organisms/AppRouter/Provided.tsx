import React from "react";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

export interface ProvidedProps {
  withRelatedVenues?: boolean;
}

export const Provided: React.FC<ProvidedProps> = ({
  children,
  withRelatedVenues = false,
}) => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  const { space, spaceId } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  if (!withRelatedVenues) return <>{children}</>;

  return (
    <RelatedVenuesProvider venueId={spaceId} worldId={space?.worldId}>
      {children}
    </RelatedVenuesProvider>
  );
};
