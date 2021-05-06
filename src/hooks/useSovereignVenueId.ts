import { useEffect } from "react";
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

  useEffect(() => {
    // The change of venueId will not trigger the fetching of sovereignVenueId
    if (sovereignVenueId || isSovereignVenueIdLoading || errorMsg || !venueId)
      return;

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
  }, [
    sovereignVenueId,
    isSovereignVenueIdLoading,
    errorMsg,
    venueId,
    dispatch,
  ]);

  return {
    sovereignVenueId,
    isSovereignVenueIdLoading,
  };
};
