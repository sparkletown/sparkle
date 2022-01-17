import React from "react";

import { SpaceSlugLocation } from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";

type WithSlugs = <T>(
  Component: React.FC<T & SpaceSlugLocation>
) => React.FC<Omit<T, keyof SpaceSlugLocation>>;

export const withSlugs: WithSlugs = (Component) => {
  const WithSlugs: React.FC = (props) => {
    const { worldSlug, spaceSlug } = useSpaceParams();

    const C = Component as React.FC<typeof props & SpaceSlugLocation>;
    return <C {...props} worldSlug={worldSlug} spaceSlug={spaceSlug} />;
  };

  hoistHocStatics("withSlugs", WithSlugs, Component);
  return WithSlugs;
};
