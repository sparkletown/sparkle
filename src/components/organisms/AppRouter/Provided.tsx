import React from "react";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";
import { useSpaceParams } from "hooks/useSpaceParams";

export interface ProvidedProps {
  withRelatedVenues?: boolean;
}

export const Provided: React.FC<ProvidedProps> = ({
  children,
  withRelatedVenues = false,
}) => {
  const spaceSlug = useSpaceParams();
  const { space, spaceId } = useSpaceBySlug(spaceSlug);

  if (!withRelatedVenues) return <>{children}</>;

  return (
    <RelatedVenuesProvider venueId={spaceId} worldId={space?.worldId}>
      {children}
    </RelatedVenuesProvider>
  );
};
