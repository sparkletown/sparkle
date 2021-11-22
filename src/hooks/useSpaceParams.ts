import { useParams } from "react-router-dom";
import { useSearchParam } from "react-use";

export interface SpaceParams {
  spaceSlug?: string;
}

/**
 * Retrieve the venueId from the URL path (/:spaceSlug/) or the search query string (?spaceSlug=).
 *
 * @see https://reactrouter.com/web/api/Hooks/useparams
 */
export const useSpaceParams: () => string | undefined = () => {
  const { spaceSlug: slugParam } = useParams<SpaceParams>();

  // @debt fallback for legacy ?foo=bar pattern. remove once codebase replaces it with /:bar/ paths in the URL
  const slugQuery = useSearchParam("spaceSlug");

  return slugParam ?? slugQuery ?? undefined;
};
