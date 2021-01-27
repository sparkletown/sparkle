import { fetchSovereignVenueId } from "api/sovereignVenue";

import {
  setSovereignVenueId,
  setSovereignVenueIdIsLoading,
  setSovereignVenueIdError,
} from "store/actions/SovereignVenue";

import { sovereignVenueIdSelector } from "utils/selectors";

import { useDispatch } from "./useDispatch";
import { useSelector } from "./useSelector";

export const useSovereignVenueId = (venueId?: string) => {
  const dispatch = useDispatch();

  const {
    id: sovereignVenueId,
    isLoading: isSovereignVenueIdLoading,
    errorMsg,
  } = useSelector(sovereignVenueIdSelector);

  // NOTE: Force to fetch it only once
  if (!sovereignVenueId && !isSovereignVenueIdLoading && !errorMsg && venueId) {
    dispatch(setSovereignVenueIdIsLoading(true));
    fetchSovereignVenueId(venueId)
      .then((sovereignVenueId) => {
        dispatch(setSovereignVenueId(sovereignVenueId));
      })
      .catch((errorMsg) => {
        // NOTE: A workaround, if the sovereign venue errored while being fertched
        dispatch(setSovereignVenueId(venueId));
        // @debt Not used currently
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
