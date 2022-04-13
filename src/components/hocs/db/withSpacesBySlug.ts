import React from "react";
import { get } from "lodash/fp";

import {
  MaybeWorldIdLocation,
  SpaceId,
  SpacesSlugLocation,
  SpaceWithId,
} from "types/id";

import { hoistHocStatics } from "utils/hoc";

import { useSpacesBySlug } from "hooks/spaces/useSpacesBySlug";

type Attributes = SpacesSlugLocation & MaybeWorldIdLocation;
type Props<T extends Attributes> = T;

export type WithSpacesBySlugProps = {
  isSpacesLoaded: boolean;
  isSpacesLoading: boolean;
  space: SpaceWithId;
  spaces: SpaceWithId[];
  spaceId: SpaceId;
};

export const withSpacesBySlug = <T extends Attributes>(
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
