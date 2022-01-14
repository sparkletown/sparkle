import React from "react";

import { World } from "api/world";

import { AnyVenue } from "types/venues";

import { determineDisplayName } from "utils/hoc";
import { WithId } from "utils/id";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useWorldAndSpaceBySlug } from "hooks/spaces/useWorldAndSpaceBySlug";

interface WorldAndSpaceByUrlAdditionalProps {
  world?: WithId<World>;
  space?: WithId<AnyVenue>;
}

export const withWorldAndSpaceFromUrl = <T,>() => (
  Component: React.FC<T>
): React.FC<Omit<T, keyof WorldAndSpaceByUrlAdditionalProps>> => {
  const WithFetch: React.FC<
    Omit<T, keyof WorldAndSpaceByUrlAdditionalProps>
  > = (props) => {
    const slugs = useSpaceParams();
    const { space, world } = useWorldAndSpaceBySlug(
      slugs.worldSlug,
      slugs.spaceSlug
    );

    // We don't care if the component doesn't support all the props, just ignore
    // the typing error here
    // eslint-disable-next-line
    // @ts-ignore
    return <Component {...props} world={world} space={space} />;
  };

  WithFetch.displayName = `withFetch(${determineDisplayName(Component)})`;
  return WithFetch;
};
