import { matchPath, useHistory } from "react-router-dom";

type VenueRoute = {
  venueId: string;
};

// Sometimes in a nested route we want venue ID
const venuePaths = [
  "/e/:step/:venueId",
  "/in/:venueId",
  "/v/:venueId",
  "/admin_v2/venue/:venueId",
];
export const useVenueId: () => string | undefined = () => {
  const history = useHistory();

  for (const path of venuePaths) {
    const match = matchPath<VenueRoute>(history.location.pathname, {
      path,
    });

    if (match && match.params.venueId) {
      return match.params.venueId;
    }
  }
};
