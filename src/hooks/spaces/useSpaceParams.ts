import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSearchParam } from "react-use";

import { SpaceSlug, SpaceSlugLocation, WorldSlug } from "types/id";

/**
 * Retrieve the slugs from the URL path ( /:worldSlug/ , /:spaceSlug/ )
 * or the search query string ( ?spaceSlug= , &worldSlug= )
 */
export const useSpaceParams = () => {
  const {
    spaceSlug: spaceSlugFromParams,
    worldSlug: worldSlugFromParams,
  } = useParams<Partial<SpaceSlugLocation>>();

  // fallback for ?foo=bar pattern in case it is used as a redirect back
  const spaceSlugFromQuery = useSearchParam("spaceSlug") as SpaceSlug;
  const worldSlugFromQuery = useSearchParam("worldSlug") as WorldSlug;

  return useMemo(() => {
    const spaceSlug = spaceSlugFromParams ?? spaceSlugFromQuery ?? undefined;
    const worldSlug = worldSlugFromParams ?? worldSlugFromQuery ?? undefined;

    return {
      spaceSlug,
      worldSlug,

      spaceSlugFromParams,
      spaceSlugFromQuery,

      worldSlugFromParams,
      worldSlugFromQuery,
    };
  }, [
    spaceSlugFromParams,
    worldSlugFromParams,
    spaceSlugFromQuery,
    worldSlugFromQuery,
  ]);
};
