import React from "react";
import { get } from "lodash/fp";

import { WorldId, WorldSlugLocation, WorldWithId } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

type Attributes = WorldSlugLocation;
type Props<T extends Attributes> = T;

export type WithWorldBySlugProps = {
  isWorldLoading: boolean;
  isWorldLoaded: boolean;
  world: WorldWithId;
  worldId: WorldId;
};

export const withWorldBySlug = <T extends Attributes>(
  Component: React.FC<Props<T>>
) => {
  const WithWorldBySlug = (props: Props<T>) => {
    const { world, isLoading, isLoaded } = useWorldBySlug(props.worldSlug);
    return React.createElement(Component, {
      ...props,
      world,
      worldId: world?.id ?? get("worldId", props),
      isWorldLoading: isLoading,
      isWorldLoaded: isLoaded,
    });
  };

  hoistHocStatics("withWorldBySlug", WithWorldBySlug, Component);
  return WithWorldBySlug;
};
