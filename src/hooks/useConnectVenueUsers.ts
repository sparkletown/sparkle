import {
  ReduxFirestoreQuerySetting,
  useFirestoreConnect,
} from "react-redux-firebase";

import { useVenueId } from "./useVenueId";

/**
 * Fetches the users who have entered the current venue and then populates them in redux as venueUsers.
 * @return void
 *
 * @example
 *
 *  useConnectVenueUsers()
 *  const venueUsers = useSelector(venueUsersSelector)
 */
export const useConnectVenueUsers = () => {
  const venueId = useVenueId();

  const venueUsersQuery: ReduxFirestoreQuerySetting = {
    collection: "users",
    where: ["enteredVenueIds", "array-contains", venueId],
    storeAs: "venueUsers",
  };
  useFirestoreConnect(venueId ? venueUsersQuery : undefined);
};
