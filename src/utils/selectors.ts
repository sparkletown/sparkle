import { FirebaseReducer } from "react-redux-firebase";

import { RootState } from "index";

import { AnyVenue } from "types/Firestore";
import { Purchase } from "types/Purchase";
import { SparkleSelector } from "types/SparkleSelector";
import { User } from "types/User";
import { VenueEvent } from "types/VenueEvent";

import { WithId } from "utils/id";

import {
  makeIsRequestedSelector,
  makeOrderedSelector,
} from "./firestoreSelectors";

/**
 * Selector to retrieve Firebase auth from Redux.
 *
 * @param state the Redux store
 */
export const authSelector: SparkleSelector<FirebaseReducer.AuthState> = (
  state: RootState
) => state.firebase.auth;

/**
 * Selector to retrieve Firebase profile from Redux.
 *
 * @param state the Redux store
 */
export const profileSelector: SparkleSelector<FirebaseReducer.Profile<User>> = (
  state: RootState
) => state.firebase.profile;

/**
 * Selector to retrieve currentVenue?.[0] from the Redux Firestore.
 *
 * @param state the Redux store
 */
export const currentVenueSelector: SparkleSelector<AnyVenue> = (
  state: RootState
) => state.firestore.ordered.currentVenue?.[0];

// @debt can we merge this with currentVenueSelector and just use 1 canonical version?
export const currentVenueSelectorData: SparkleSelector<AnyVenue | undefined> = (
  state
) => state.firestore.data.currentVenue;

/**
 * Selector to retrieve partygoers from the Redux Firestore.
 *
 * @param state the Redux store
 */
export const partygoersSelector: SparkleSelector<WithId<User>[]> = (
  state: RootState
) => state.firestore.ordered.partygoers;

/**
 * Selector to retrieve venues from the Redux Firestore.
 *
 * @param state the Redux store
 */
export const venuesSelector: SparkleSelector<Record<string, AnyVenue>> = (
  state
) => state.firestore.data.venues || {};

export const orderedVenuesSelector: SparkleSelector<
  WithId<AnyVenue>[] | undefined
> = (state) => state.firestore.ordered.venues;

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

export const currentEventSelector: SparkleSelector<
  WithId<VenueEvent>[]
> = makeOrderedSelector("currentEvent");

export const userPurchaseHistorySelector: SparkleSelector<
  WithId<Purchase>[]
> = makeOrderedSelector("userPurchaseHistory");

export const shouldRetainAttendanceSelector: SparkleSelector<boolean> = (
  state: RootState
) => state.attendance.retainAttendance;

export const isCurrentVenueRequestedSelector: SparkleSelector<boolean> = makeIsRequestedSelector(
  "currentVenue"
);

export const isCurrentEventRequestedSelector: SparkleSelector<boolean> = makeIsRequestedSelector(
  "currentEvent"
);

export const isUserPurchaseHistoryRequestedSelector: SparkleSelector<boolean> = makeIsRequestedSelector(
  "userPurchaseHistory"
);
