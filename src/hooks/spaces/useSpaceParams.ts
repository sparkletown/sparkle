import { useParams } from "react-router-dom";
import { useSearchParam } from "react-use";

import { SpaceSlug } from "types/venues";
import { WorldSlug } from "types/world";

export interface SpaceParams {
  spaceSlug?: SpaceSlug;
  worldSlug?: WorldSlug;
}

/**
 * Retrieve the slugs from the URL path ( /:worldSlug/ , /:spaceSlug/ )
 * or the search query string ( ?spaceSlug= , &worldSlug= )
 */
export const useSpaceParams = () => {
  const {
    spaceSlug: spaceSlugFromParams,
    worldSlug: worldSlugFromParams,
  } = useParams<SpaceParams>();

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
