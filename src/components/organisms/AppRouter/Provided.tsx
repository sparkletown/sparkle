import React from "react";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";
import { RelatedVenuesProvider } from "hooks/useRelatedVenues";
import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

export interface ProvidedProps {
  withRelatedVenues?: boolean;
}

export const Provided: React.FC<ProvidedProps> = ({
  children,
  withRelatedVenues = false,
}) => {
  const { worldSlug, spaceSlug } = useSpaceParams();
  // @debt This provider is used in cases where we don't have a space slug
  // Therefore, we need to call useWorldBySlug as well as calling
  // useWorldAndSpaceBySlug.
  // Refactoring that is more risky than makes sense right now (big events
  // coming up). Therefore, we do best effort here. This provider shouldn't
  // need a space at all. Related venues can be derived entirely from a world
  // now.
  const { world } = useWorldBySlug(worldSlug);
  const { spaceId } = useWorldAndSpaceBySlug(worldSlug, spaceSlug);

  if (!withRelatedVenues) return <>{children}</>;

  return (
    <RelatedVenuesProvider venueId={spaceId} worldId={world?.id}>
      {children}
    </RelatedVenuesProvider>
  );
};
