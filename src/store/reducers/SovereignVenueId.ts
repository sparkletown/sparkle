import {
  SovereignVenueIdActions,
  SovereignVenueIdActionTypes,
} from "store/actions/SovereignVenueId";

export type SovereignVenueIdState = {
  sovereignVenueId?: string;
  isSovereignVenueIdLoading: boolean;
};

const initialWorldVenueState: SovereignVenueIdState = {
  isSovereignVenueIdLoading: false,
};

export const sovereignVenueIdReducer = (
  state = initialWorldVenueState,
  action: SovereignVenueIdActions
): SovereignVenueIdState => {
  switch (action.type) {
    case SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_ID:
      return { ...state, sovereignVenueId: action.payload };
    case SovereignVenueIdActionTypes.SET_SOVEREIGN_VENUE_IS_LOADED:
      return { ...state, isSovereignVenueIdLoading: action.payload };
    default:
      return state;
  }
};
