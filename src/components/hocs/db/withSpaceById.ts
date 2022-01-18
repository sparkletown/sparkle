import React from "react";
import { get } from "lodash/fp";

import { SpaceIdLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";

type WithSpaceByIdInProps<T extends SpaceIdLocation> = T;

export const withSpaceById = <T extends SpaceIdLocation>(
  Component: React.FC<WithSpaceByIdInProps<T>>
) => {
  const WithSpaceById = (props: WithSpaceByIdInProps<T>) => {
    const { currentVenue: space } = useConnectCurrentVenueNG(props);
    return React.createElement(Component, {
      ...props,
      space,
      spaceId: space?.id ?? get("spaceId", props),
      worldId: space?.worldId ?? get("worldId", props),
    });
  };

  hoistHocStatics("withSpaceById", WithSpaceById, Component);
  return WithSpaceById;
};
