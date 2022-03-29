import React from "react";
import { get } from "lodash/fp";

import { SpaceId } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useSpaceById } from "hooks/spaces/useSpaceById";

type Attributes = { spaceId: SpaceId };
type Props<T extends Attributes> = T;

export const withSpaceById = <T extends Attributes>(
  Component: React.FC<Props<T>>
) => {
  const WithSpaceById = (props: Props<T>) => {
    const { space, spaceId, worldId, isLoaded, isLoading } = useSpaceById(
      props.spaceId
    );
    return React.createElement(Component, {
      ...props,
      space,
      spaceId: spaceId ?? get("spaceId", props),
      worldId: worldId ?? get("worldId", props),
      isSpaceLoading: isLoading,
      isSpaceLoaded: isLoaded,
    });
  };

  hoistHocStatics("withSpaceById", WithSpaceById, Component);
  return WithSpaceById;
};
