import { useEffect } from "react";
import {
  setSovereignVenueId,
  setSovereignVenueIdIsLoading,
  setSovereignVenueIdError,
} from "store/actions/SovereignVenue";

import { fetchSovereignVenue } from "api/venue";

import { ReactHook } from "types/utility";

import { sovereignVenueIdSelector } from "utils/selectors";
import { tracePromise } from "utils/performance";

import { useDispatch } from "./useDispatch";
import { useSelector } from "./useSelector";

export interface UseSovereignVenueIdProps {
  venueId?: string;
}

export interface UseSovereignVenueIdData {
  sovereignVenueId?: string;
  isSovereignVenueIdLoading: boolean;
  errorMsg?: string;
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

  useEffect(() => {
    // NOTE: Force to fetch it only once
    if (!venueId || sovereignVenueId || isSovereignVenueIdLoading || errorMsg)
      return;

    dispatch(setSovereignVenueIdIsLoading(true));

    tracePromise(
      "useSovereignVenueId::fetchSovereignVenue",
      () => fetchSovereignVenue(venueId),
      {
        attributes: {
          venueId,
        },
      }
    )
      .then(({ sovereignVenue }) => {
        console.log("succcess", sovereignVenue);

        dispatch(setSovereignVenueId(sovereignVenue.id));
      })
      .catch((errorMsg) => {
        console.log("error", errorMsg);
        // @debt Just to stop spamming firebase with requests
        dispatch(setSovereignVenueIdError(errorMsg));
      })
      .finally(() => {
        dispatch(setSovereignVenueIdIsLoading(false));
      });
  }, [
    dispatch,
    errorMsg,
    isSovereignVenueIdLoading,
    sovereignVenueId,
    venueId,
  ]);

  return {
    sovereignVenueId,
    isSovereignVenueIdLoading,
    errorMsg,
  };
};
