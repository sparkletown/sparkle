import React from "react";
import { get } from "lodash/fp";

import { SpaceIdLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

type Props<T extends SpaceIdLocation> = T;

export const withSpaceAndEventsById = <T extends SpaceIdLocation>(
  Component: React.FC<Props<T>>
) => {
  const WithSpaceAndEventsById = (props: Props<T>) => {
    const { currentVenue: space } = useConnectCurrentVenueNG(props);
    return React.createElement(Component, {
      ...props,
      space,
      spaceId: space?.id ?? get("spaceId", props),
      worldId: space?.worldId ?? get("worldId", props),
    });
  };

  hoistHocStatics("withSpaceAndEventsById", WithSpaceAndEventsById, Component);
  return WithSpaceAndEventsById;
};
