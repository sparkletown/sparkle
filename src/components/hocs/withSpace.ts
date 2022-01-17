import React from "react";
import { get } from "lodash/fp";

import { SpaceSlugLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

type WithSpaceInProps<T extends SpaceSlugLocation> = T;

export const withSpace = <T extends SpaceSlugLocation>(
  Component: React.FC<WithSpaceInProps<T>>
) => {
  const WithSpace = (props: WithSpaceInProps<T>) => {
    const { space } = useWorldAndSpaceBySlug(props.worldSlug, props.spaceSlug);
    return React.createElement(Component, {
      ...props,
      space,
      spaceId: space?.id ?? get("spaceId", props),
      worldId: space?.worldId ?? get("worldId", props),
    });
  };

  hoistHocStatics("withSpace", WithSpace, Component);
  return WithSpace;
};
