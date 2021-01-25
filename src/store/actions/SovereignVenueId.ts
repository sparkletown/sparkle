export enum SovereignVenueIdActionTypes {
  SET_SOVEREIGN_VENUE_ID = "SET_SOVEREIGN_VENUE_ID",
  SET_SOVEREIGN_VENUE_IS_LOADED = "SET_SOVEREIGN_VENUE_IS_LOADED",
}

type setSovereignVenueIdIsLoadingAction = {
  type: SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_IS_LOADED;
  payload: boolean;
};

type SetSovereignVenueIdAction = {
  type: SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_ID;
  payload: string;
};

export const setSovereignVenueIdIsLoading = (
  isLoading: boolean
): setSovereignVenueIdIsLoadingAction => ({
  type: SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_IS_LOADED,
  payload: isLoading,
});

export const setSovereignVenueId = (
  sovereignVenueId: string
): SetSovereignVenueIdAction => ({
  type: SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_ID,
  payload: sovereignVenueId,
});

export type SovereignVenueIdActions =
  | setSovereignVenueIdIsLoadingAction
  | SetSovereignVenueIdAction;
