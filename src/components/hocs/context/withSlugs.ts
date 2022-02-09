import React, { PropsWithChildren } from "react";

import { WorldAndSpaceSlugLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

type Attributes = {};
type Props<T = {}> = T & Attributes;

export type WithSlugsProps = Partial<WorldAndSpaceSlugLocation>;

export const withSlugs = <T extends Attributes>(
  Component: React.FC<Props<T>>
) => {
  const WithSlugs = (props: PropsWithChildren<T>) => {
    const { worldSlug, spaceSlug } = useSpaceParams();
    return React.createElement(Component, { ...props, worldSlug, spaceSlug });
  };

  hoistHocStatics("withSlugs", WithSlugs, Component);
  return WithSlugs;
};
