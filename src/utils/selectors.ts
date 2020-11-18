import { RootState } from "index";
import { AnyVenue } from "types/Firestore";
import { SparkleSelector } from "types/SparkleSelector";
import { WithId } from "./id";

/**
 * Selector to retrieve venues from the Redux Firestore.
 *
 * @param state the Redux store
 */
export const venuesSelector: SparkleSelector<Record<string, AnyVenue>> = (
  state
) => state.firestore.data.venues || {};

/**
 * Makes a venueSelector selector for a given venueId, which when called
 * will retrieve the specified venue from the Redux Firestore.
 *
 * @param venueId the venueId to be retrieved
 * @return (state: RootState) => WithId<AnyVenue> | undefined
 *
 * @example
 *   const venueId = 'abc123'
 *   const venueSelector = useCallback(makeVenueSelector(venueId), [venueId])
 *   const venue = useSelector(venueSelector, shallowEqual)
 */
export const makeVenueSelector = (venueId: string) => (
  state: RootState
): WithId<AnyVenue> | undefined => {
  const venues = venuesSelector(state);

  if (!venues.hasOwnProperty(venueId)) return undefined;

  return { ...venues[venueId], id: venueId };
};

export const privateChatsSelector = (state: RootState) =>
  state.firestore.ordered.privatechats;
export const chatUsersSelector = (state: RootState) =>
  state.firestore.data.chatUsers;
export const venueSelector = (state: RootState) =>
  state.firestore.ordered.currentVenue &&
  state.firestore.ordered.currentVenue[0];
export const venueEventsSelector = (state: RootState) =>
  state.firestore.ordered.venueEvents;
