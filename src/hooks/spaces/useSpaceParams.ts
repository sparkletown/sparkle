import { useParams } from "react-router-dom";
import { useSearchParam } from "react-use";

export interface SpaceParams {
  spaceSlug?: string;
  worldSlug?: string;
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
  const spaceSlugFromQuery = useSearchParam("spaceSlug");
  const worldSlugFromQuery = useSearchParam("worldSlug");

  return {
    spaceSlug: spaceSlugFromParams ?? spaceSlugFromQuery ?? undefined,
    worldSlug: worldSlugFromParams ?? worldSlugFromQuery ?? undefined,

    spaceSlugFromParams,
    spaceSlugFromQuery,

    worldSlugFromParams,
    worldSlugFromQuery,
  };
};
