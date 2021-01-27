import {
  SovereignVenueIdActions,
  SovereignVenueIdActionTypes,
} from "store/actions/SovereignVenue";

export type SovereignVenueState = {
  id?: string;
  errorMsg?: string;
  isLoading: boolean;
};

const initialSovereignVenueState: SovereignVenueState = {
  isLoading: false,
};

export const sovereignVenueReducer = (
  state = initialSovereignVenueState,
  action: SovereignVenueIdActions
): SovereignVenueState => {
  switch (action.type) {
    case SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_ID:
      return { ...state, id: action.payload.sovereignVenueId };
    case SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_IS_LOADED:
      return { ...state, isLoading: action.payload.isLoading };
    case SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_ERROR:
      return { ...state, errorMsg: action.payload.errorMsg };
    default:
      return state;
  }
};
