import {
  SovereignVenueActions,
  SovereignVenueActionTypes,
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
  action: SovereignVenueActions
): SovereignVenueState => {
  switch (action.type) {
    case SovereignVenueActionTypes.SET_SOVEREIGN_VENUE_ID:
      return {
        ...state,
        id: action.payload.sovereignVenueId,
        isLoading: false,
        errorMsg: undefined,
      };
    case SovereignVenueActionTypes.SET_SOVEREIGN_VENUE_IS_LOADING:
      return { ...state, isLoading: action.payload.isLoading };
    case SovereignVenueActionTypes.SET_SOVEREIGN_VENUE_ERROR:
      return {
        ...state,
        errorMsg: action.payload.errorMsg,
        isLoading: false,
        id: undefined,
      };
    default:
      return state;
  }
};
