import React from "react";
import { get } from "lodash/fp";

import { SpaceSlugLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

type WithSpaceInProps<T extends SpaceSlugLocation> = T;

export const withWorldAndSpace = <T extends SpaceSlugLocation>(
  Component: React.FC<WithSpaceInProps<T>>
) => {
  const WithWorldAndSpace = (props: WithSpaceInProps<T>) => {
    const { space, world } = useWorldAndSpaceBySlug(props);
    return React.createElement(Component, {
      ...props,
      space,
      world,
      spaceId: space?.id ?? get("spaceId", props),
      worldId: space?.worldId ?? get("worldId", props),
    });
  };

  hoistHocStatics("withWorldAndSpace", WithWorldAndSpace, Component);
  return WithWorldAndSpace;
};
