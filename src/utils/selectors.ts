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
  state
) => state.firebase.auth;

/**
 * Selector to retrieve Firebase profile from Redux.
 *
 * @param state the Redux store
 */
export const profileSelector: SparkleSelector<FirebaseReducer.Profile<User>> = (
  state
) => state.firebase.profile;

/**
 * Selector to retrieve currentVenue?.[0] from the Redux Firestore.
 *
 * @param state the Redux store
 */
export const currentVenueSelector: SparkleSelector<WithId<AnyVenue>> = (
  state
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
export const partygoersSelector: SparkleSelector<WithId<User>[] | undefined> = (
  state
) => state.firestore.ordered.partygoers;

/**
 * Selector to retrieve partygoers from the Redux Firestore.
 *
 * @param state the Redux store
 */
export const partygoersSelectorData: SparkleSelector<
  Record<string, User> | undefined
> = (state) => state.firestore.data.partygoers;

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
  state
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

export const privateChatsSelector = (state: RootState) =>
  state.firestore.ordered.privatechats;

export const chatUsersSelector = (state: RootState) =>
  state.firestore.data.chatUsers;

export const venueSelector = (state: RootState) =>
  state.firestore.ordered.currentVenue &&
  state.firestore.ordered.currentVenue[0];

export const parentVenueOrderedSelector: SparkleSelector<
  WithId<AnyVenue> | undefined
> = (state) => state.firestore.ordered.parentVenue?.[0];

export const parentVenueSelector: SparkleSelector<AnyVenue | undefined> = (
  state
) => state.firestore.data.parentVenue;

export const subvenuesSelector: SparkleSelector<
  WithId<AnyVenue>[] | undefined
> = (state) => state.firestore.ordered.subvenues;

export const siblingVenuesSelector: SparkleSelector<
  WithId<AnyVenue>[] | undefined
> = (state) => state.firestore.ordered.siblingVenues;

export const venueEventsSelector: SparkleSelector<
  WithId<VenueEvent>[] | undefined
> = (state) => state.firestore.ordered.venueEvents;

export const parentVenueEventsSelector: SparkleSelector<
  WithId<VenueEvent>[] | undefined
> = (state: RootState) => state.firestore.ordered.parentVenueEvents;

export const makeSubvenueEventsSelector = (venueId?: string) => (
  state: RootState
): WithId<VenueEvent>[] | undefined =>
  (state.firestore.ordered as any)[`subvenueEvents-${venueId}`];

export const makeSiblingVenueEventsSelector = (venueId?: string) => (
  state: RootState
): WithId<VenueEvent>[] | undefined =>
  (state.firestore.ordered as any)[`siblingVenueEvents-${venueId}`];

export const radioStationsSelector = (state: RootState) =>
  state.firestore.data.venues?.playa?.radioStations;

export const maybeSelector = <T extends SparkleSelector<U>, U>(
  ifTrue: boolean,
  selector: SparkleSelector<U>
) => (ifTrue ? selector : noopSelector);

export const maybeArraySelector = <T extends SparkleSelector<U[]>, U>(
  ifTrue: boolean,
  selector: SparkleSelector<U[]>
) => (ifTrue ? selector : emptyArraySelector);

export const noopSelector: SparkleSelector<undefined> = () => undefined;

export const emptyArray = [];
export const emptyArraySelector = <T extends SparkleSelector<U>, U>() =>
  emptyArray as U[];
