import { useParams } from "react-router-dom";
import { useSearchParam } from "react-use";

interface ParamsTypes {
  venueId?: string;
}

/**
 * Retrieve the venueId from the URL path (/:venueId/) or the search query string (?venueId=).
 *
 * @see https://reactrouter.com/web/api/Hooks/useparams
 */
export const useVenueId: () => string | undefined = () => {
  const { venueId: urlParamVenueId } = useParams() as ParamsTypes;

  // @debt this is a fallback for our legacy ?venueId=foo pattern. Once we eradicate that
  //   from the codebase in favour of using /:venueId/ paths in the URL, we can remove this.
  const searchParamVenueId = useSearchParam("venueId");

  return urlParamVenueId ?? searchParamVenueId ?? undefined;
};
