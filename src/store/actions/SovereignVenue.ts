import { AnyVenue } from "types/venues";
import { ReduxAction } from "types/redux";

import { WithId } from "utils/id";

export enum SovereignVenueActionTypes {
  SET_SOVEREIGN_VENUE = "SET_SOVEREIGN_VENUE",
  SET_SOVEREIGN_VENUE_IS_LOADING = "SET_SOVEREIGN_VENUE_IS_LOADING",
  SET_SOVEREIGN_VENUE_ERROR = "SET_SOVEREIGN_VENUE_ERROR",
}

type SetSovereignVenueIsLoadingAction = ReduxAction<
  SovereignVenueActionTypes.SET_SOVEREIGN_VENUE_IS_LOADING,
  { isLoading: boolean }
>;

type SetSovereignVenueErrorAction = ReduxAction<
  SovereignVenueActionTypes.SET_SOVEREIGN_VENUE_ERROR,
  { errorMsg: string }
>;

type SetSovereignVenueAction = ReduxAction<
  SovereignVenueActionTypes.SET_SOVEREIGN_VENUE,
  { sovereignVenue: WithId<AnyVenue> }
>;

export const setSovereignVenueIsLoading = (
  isLoading: boolean
): SetSovereignVenueIsLoadingAction => ({
  type: SovereignVenueActionTypes.SET_SOVEREIGN_VENUE_IS_LOADING,
  payload: { isLoading },
});

export const setSovereignVenueError = (
  errorMsg: string
): SetSovereignVenueErrorAction => ({
  type: SovereignVenueActionTypes.SET_SOVEREIGN_VENUE_ERROR,
  payload: { errorMsg },
});

export const setSovereignVenue = (
  sovereignVenue: WithId<AnyVenue>
): SetSovereignVenueAction => ({
  type: SovereignVenueActionTypes.SET_SOVEREIGN_VENUE,
  payload: { sovereignVenue },
});

export type SovereignVenueActions =
  | SetSovereignVenueIsLoadingAction
  | SetSovereignVenueErrorAction
  | SetSovereignVenueAction;
