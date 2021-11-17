import { useParams } from "react-router-dom";
import { useSearchParam } from "react-use";

export interface SpaceParams {
  spaceSlug?: string;
}

/**
 * Retrieve the venueId from the URL path (/:venueId/) or the search query string (?venueId=).
 *
 * @see https://reactrouter.com/web/api/Hooks/useparams
 */
export const useSpaceParams: () => string | undefined = () => {
  const { spaceSlug: urlParamVenueId } = useParams() as SpaceParams;

  // @debt this is a fallback for our legacy ?venueId=foo pattern. Once we eradicate that
  //   from the codebase in favour of using /:venueId/ paths in the URL, we can remove this.
  const searchParamVenueId = useSearchParam("venueId");

  return urlParamVenueId ?? searchParamVenueId ?? undefined;
};
