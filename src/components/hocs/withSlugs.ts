import React from "react";

import { SpaceSlugLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

type WithSlugsInProps<T extends SpaceSlugLocation> = T;

export const withSlugs = <T extends SpaceSlugLocation>(
  Component: React.FC<WithSlugsInProps<T>>
) => {
  const WithSlugs = (props: WithSlugsInProps<T>) => {
    const { worldSlug, spaceSlug } = useSpaceParams();
    return React.createElement(Component, { ...props, worldSlug, spaceSlug });
  };

  hoistHocStatics("withSlugs", WithSlugs, Component);
  return WithSlugs;
};
