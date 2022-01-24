import React from "react";
import { get } from "lodash/fp";

import {
  MaybeWorldIdLocation,
  SpaceSlugLocation,
  SpacesSlugLocation,
} from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useSpacesBySlug } from "hooks/spaces/useSpacesBySlug";

type Props<T extends SpacesSlugLocation & MaybeWorldIdLocation> = T;

export const withSpacesBySlug = <T extends SpaceSlugLocation>(
  Component: React.FC<Props<T>>
) => {
  const WithSpacesBySlug = (props: Props<T>) => {
    const { space, spaces, spaceId, isLoaded, isLoading } = useSpacesBySlug(
      props
    );

    return React.createElement(Component, {
      ...props,
      space,
      spaces,
      spaceId: spaceId ?? get("spaceId", props),
      isSpacesLoaded: isLoaded,
      isSpacesLoading: isLoading,
    });
  };

  hoistHocStatics("withSpacesBySlug", WithSpacesBySlug, Component);
  return WithSpacesBySlug;
};
