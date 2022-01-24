import React, { PropsWithChildren } from "react";

import { SpaceSlugLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

export const withSlugs = <T = {}>(
  Component: React.FC<T & SpaceSlugLocation>
) => {
  const WithSlugs = (props: PropsWithChildren<T>) => {
    const { worldSlug, spaceSlug } = useSpaceParams();
    return React.createElement(Component, { ...props, worldSlug, spaceSlug });
  };

  hoistHocStatics("withSlugs", WithSlugs, Component);
  return WithSlugs;
};
