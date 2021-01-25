import { useParams } from "react-router-dom";

interface ParamsTypes {
  venueId?: string;
}

/**
 * Retrieve the venueId from the URL path.
 *
 * @see https://reactrouter.com/web/api/Hooks/useparams
 */
export const useVenueId: () => string | undefined = () => {
  const { venueId } = useParams() as ParamsTypes;

  if (venueId && typeof venueId === "string") return venueId;

  return undefined;
};
