import { useParams } from "react-router-dom";

/**
 * Retrieve the venueId from the URL path.
 *
 * @see https://reactrouter.com/web/api/Hooks/useparams
 */
export const useVenueId: () => string | undefined = () => {
  const { venueId } = useParams();

  if (typeof venueId === "string") return venueId;

  return undefined;
};
