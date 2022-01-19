import React from "react";
import { get } from "lodash/fp";

import { SpaceSlugLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useWorldOrSpaceBySlug } from "hooks/spaces/useWorldOrSpaceBySlug";

type WithSpaceInProps<T extends SpaceSlugLocation> = T;

export const withWorldOrSpace = <T extends SpaceSlugLocation>(
  Component: React.FC<WithSpaceInProps<T>>
) => {
  const WithWorldOrSpace = (props: WithSpaceInProps<T>) => {
    const { space, world, isLoaded, isLoading } = useWorldOrSpaceBySlug(props);

    const spaceId = space?.id ?? get("spaceId", props);
    const worldId = space?.worldId ?? get("worldId", props);

    return React.createElement(Component, {
      ...props,
      space,
      world,
      spaceId: spaceId,
      worldId: worldId,
      isWorldOrSpaceLoaded: isLoaded,
      isWorldOrSpaceLoading: isLoading,
    });
  };

  hoistHocStatics("withWorldOrSpace", WithWorldOrSpace, Component);
  return WithWorldOrSpace;
};
