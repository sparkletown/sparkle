import React from "react";
import { get } from "lodash/fp";

import { WorldSlugLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

type WithWorldInProps<T extends WorldSlugLocation> = T;

export const withWorld = <T extends WorldSlugLocation>(
  Component: React.FC<WithWorldInProps<T>>
) => {
  const WithWorld = (props: WithWorldInProps<T>) => {
    const { world } = useWorldBySlug(props.worldSlug);
    return React.createElement(Component, {
      ...props,
      world,
      worldId: world?.id ?? get("worldId", props),
    });
  };

  hoistHocStatics("withWorld", WithWorld, Component);
  return WithWorld;
};
