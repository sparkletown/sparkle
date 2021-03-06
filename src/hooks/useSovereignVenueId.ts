import { fetchSovereignVenueId } from "api/sovereignVenue";

import {
  setSovereignVenueId,
  setSovereignVenueIdIsLoading,
  setSovereignVenueIdError,
} from "store/actions/SovereignVenue";

import { sovereignVenueIdSelector } from "utils/selectors";

import { useDispatch } from "./useDispatch";
import { useSelector } from "./useSelector";
import { useVenueId } from "./useVenueId";

export const useSovereignVenueId = () => {
  const venueId = useVenueId();
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
