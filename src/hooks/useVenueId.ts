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

// @debt I think we could just use useParams() here instead of needing to loop through all of the venuePath, so long as the use :venueId in their path
//   https://reactrouter.com/web/api/Hooks/useparams
//     useParams returns an object of key/value pairs of URL parameters. Use it to access match.params of the current <Route>.
export const useVenueId: () => string | undefined = () => {
  const history = useHistory();

  for (const path of venuePaths) {
    const match = matchPath<VenueRoute>(history.location.pathname, {
      path,
    });

    if (match?.params.venueId) {
      return match.params.venueId;
    }
  }

  return undefined;
};
