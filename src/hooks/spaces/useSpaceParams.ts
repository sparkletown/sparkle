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

  return {
    spaceSlug: spaceSlugFromParams ?? spaceSlugFromQuery ?? undefined,
    worldSlug: worldSlugFromParams ?? worldSlugFromQuery ?? undefined,

    spaceSlugFromParams,
    spaceSlugFromQuery,

    worldSlugFromParams,
    worldSlugFromQuery,
  };
};
