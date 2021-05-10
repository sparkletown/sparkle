import {
  setSovereignVenueId,
  setSovereignVenueIdIsLoading,
  setSovereignVenueIdError,
} from "store/actions/SovereignVenue";

import { fetchSovereignVenue } from "api/venue";

import { ReactHook } from "types/utility";

import { sovereignVenueIdSelector } from "utils/selectors";

import { useDispatch } from "./useDispatch";
import { useSelector } from "./useSelector";

export interface UseSovereignVenueIdProps {
  venueId?: string;
}

export interface UseSovereignVenueIdData {
  sovereignVenueId?: string;
  isSovereignVenueIdLoading: boolean;
}

export const useSovereignVenueId: ReactHook<
  UseSovereignVenueIdProps,
  UseSovereignVenueIdData
> = ({ venueId }) => {
  const dispatch = useDispatch();

  const {
    id: sovereignVenueId,
    isLoading: isSovereignVenueIdLoading,
    errorMsg,
  } = useSelector(sovereignVenueIdSelector);

  // NOTE: Force to fetch it only once
  if (!sovereignVenueId && !isSovereignVenueIdLoading && !errorMsg && venueId) {
    dispatch(setSovereignVenueIdIsLoading(true));
    fetchSovereignVenue(venueId)
      .then(({ sovereignVenue }) => {
        dispatch(setSovereignVenueId(sovereignVenue.id));
      })
      .catch((errorMsg) => {
        // @debt Just to stop spamming firebase with requests
        dispatch(setSovereignVenueIdError(errorMsg));
      })
      .finally(() => {
        dispatch(setSovereignVenueIdIsLoading(false));
      });
  }

  return {
    sovereignVenueId,
    isSovereignVenueIdLoading,
  };
};
