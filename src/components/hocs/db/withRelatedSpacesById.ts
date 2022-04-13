import React from "react";

import { MaybeSpaceIdLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { RelatedVenuesData, useRelatedVenues } from "hooks/useRelatedVenues";

type Attributes = MaybeSpaceIdLocation;
type Props<T extends Attributes> = T;

export const withRelatedSpacesById = <T extends Attributes>(
  Component: React.FC<Props<T>>
) => {
  const WithRelatedSpacesById = (props: Props<T>) => {
    const {
      currentVenue,
      isLoading,
      parentVenue,
      parentVenueId,
      // sovereignVenue,
      // sovereignVenueId,
      // sovereignVenueDescendantIds,
      relatedVenues,
      descendantVenues,
      relatedVenueIds,
      findVenueInRelatedVenues,
    }: RelatedVenuesData = useRelatedVenues({
      currentVenueId: props.spaceId,
    });

    return React.createElement(Component, {
      ...props,
      isRelatedSpacesByIdLoaded: !isLoading,
      isRelatedSpacesByIdLoading: isLoading,
      parentSpace: parentVenue,
      currentSpace: currentVenue,
      parentSpaceId: parentVenueId,
      relatedSpaces: relatedVenues,
      descendantSpaces: descendantVenues,
      relatedSpaceIds: relatedVenueIds,
      findSpaceInRelatedSpaces: findVenueInRelatedVenues,
    });
  };

  hoistHocStatics("withRelatedSpacesById", WithRelatedSpacesById, Component);
  return WithRelatedSpacesById;
};
