import React from "react";
import { get } from "lodash/fp";

import { WorldSlugLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useWorldBySlug } from "hooks/worlds/useWorldBySlug";

type WithWorldBySlugInProps<T extends WorldSlugLocation> = T;

export const withWorldBySlug = <T extends WorldSlugLocation>(
  Component: React.FC<WithWorldBySlugInProps<T>>
) => {
  const WithWorldBySlug = (props: WithWorldBySlugInProps<T>) => {
    const { world } = useWorldBySlug(props.worldSlug);
    return React.createElement(Component, {
      ...props,
      world,
      worldId: world?.id ?? get("worldId", props),
    });
  };

  hoistHocStatics("withWorldBySlug", WithWorldBySlug, Component);
  return WithWorldBySlug;
};
