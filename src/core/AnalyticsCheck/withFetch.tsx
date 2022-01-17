import React from "react";

import { SpaceSlugLocation } from "types/id";
import { AnyVenue } from "types/venues";

import { determineDisplayName } from "utils/hoc";
import { WithId } from "utils/id";

import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

import { LoadingPage } from "components/molecules/LoadingPage";

type WithFetchOutProps = { space: WithId<AnyVenue> };
type WithFetch = <T extends SpaceSlugLocation>(
  Component: React.FC<T & SpaceSlugLocation>
) => React.FC<Omit<T & SpaceSlugLocation, keyof WithFetchOutProps>>;

export const withFetch: WithFetch = (Component) => {
  const WithFetch = (props: SpaceSlugLocation) => {
    const { space } = useWorldAndSpaceBySlug(props.worldSlug, props.spaceSlug);

    const C = Component as React.FC<typeof props> & React.FC<WithFetchOutProps>;
    return space ? <C {...props} space={space} /> : <LoadingPage />;
  };

  WithFetch.displayName = `withFetch(${determineDisplayName(Component)})`;
  return WithFetch;
};
