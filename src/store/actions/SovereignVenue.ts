import { ReduxAction } from "types/redux";

export enum SovereignVenueActionTypes {
  SET_SOVEREIGN_VENUE_ID = "SET_SOVEREIGN_VENUE_ID",
  SET_SOVEREIGN_VENUE_IS_LOADING = "SET_SOVEREIGN_VENUE_IS_LOADING",
  SET_SOVEREIGN_VENUE_ERROR = "SET_SOVEREIGN_VENUE_ERROR",
}

type SetSovereignVenueIdIsLoadingAction = ReduxAction<
  SovereignVenueActionTypes.SET_SOVEREIGN_VENUE_IS_LOADING,
  { isLoading: boolean }
>;

type SetSovereignVenueIdErrorAction = ReduxAction<
  SovereignVenueActionTypes.SET_SOVEREIGN_VENUE_ERROR,
  { errorMsg: string }
>;

type SetSovereignVenueIdAction = ReduxAction<
  SovereignVenueActionTypes.SET_SOVEREIGN_VENUE_ID,
  { sovereignVenueId: string }
>;

export const setSovereignVenueIdIsLoading = (
  isLoading: boolean
): SetSovereignVenueIdIsLoadingAction => ({
  type: SovereignVenueActionTypes.SET_SOVEREIGN_VENUE_IS_LOADING,
  payload: { isLoading },
});

export const setSovereignVenueIdError = (
  errorMsg: string
): SetSovereignVenueIdErrorAction => ({
  type: SovereignVenueActionTypes.SET_SOVEREIGN_VENUE_ERROR,
  payload: { errorMsg },
});

export const setSovereignVenueId = (
  sovereignVenueId: string
): SetSovereignVenueIdAction => ({
  type: SovereignVenueActionTypes.SET_SOVEREIGN_VENUE_ID,
  payload: { sovereignVenueId },
});

export type SovereignVenueActions =
  | SetSovereignVenueIdIsLoadingAction
  | SetSovereignVenueIdErrorAction
  | SetSovereignVenueIdAction;
