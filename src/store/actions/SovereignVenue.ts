export enum SovereignVenueIdActionTypes {
  SET_SOVEREIGN_VENUE_ID = "SET_SOVEREIGN_VENUE_ID",
  SET_SOVEREIGN_VENUE_IS_LOADED = "SET_SOVEREIGN_VENUE_IS_LOADED",
  SET_SOVEREIGN_VENUE_ERROR = "SET_SOVEREIGN_VENUE_ERROR",
}

type SetSovereignVenueIdIsLoadingAction = {
  type: SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_IS_LOADED;
  payload: { isLoading: boolean };
};

type SetSovereignVenueIdErrorAction = {
  type: SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_ERROR;
  payload: { errorMsg: string };
};

type SetSovereignVenueIdAction = {
  type: SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_ID;
  payload: { sovereignVenueId: string };
};

export const setSovereignVenueIdIsLoading = (
  isLoading: boolean
): SetSovereignVenueIdIsLoadingAction => ({
  type: SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_IS_LOADED,
  payload: { isLoading },
});

export const setSovereignVenueIdError = (
  errorMsg: string
): SetSovereignVenueIdErrorAction => ({
  type: SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_ERROR,
  payload: { errorMsg },
});

export const setSovereignVenueId = (
  sovereignVenueId: string
): SetSovereignVenueIdAction => ({
  type: SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_ID,
  payload: { sovereignVenueId },
});

export type SovereignVenueIdActions =
  | SetSovereignVenueIdIsLoadingAction
  | SetSovereignVenueIdErrorAction
  | SetSovereignVenueIdAction;
