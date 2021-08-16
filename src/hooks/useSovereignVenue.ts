import { useEffect } from "react";
import { isEqual } from "lodash";

import {
  setSovereignVenue,
  setSovereignVenueIsLoading,
  setSovereignVenueError,
} from "store/actions/SovereignVenue";

import { fetchSovereignVenue } from "api/venue";

import { AnyVenue } from "types/venues";
import { ReactHook } from "types/utility";

import { WithId } from "utils/id";
import { sovereignVenueSelector } from "utils/selectors";
import { tracePromise } from "utils/performance";

import { useDispatch } from "./useDispatch";
import { useSelector } from "./useSelector";

export interface UseSovereignVenueProps {
  venueId?: string;
}

export interface UseSovereignVenueData {
  sovereignVenue?: WithId<AnyVenue>;
  sovereignVenueId?: string;
  isSovereignVenueLoading: boolean;
  errorMsg?: string;
}

export const useSovereignVenue: ReactHook<
  UseSovereignVenueProps,
  UseSovereignVenueData
> = ({ venueId }) => {
  const dispatch = useDispatch();

  const {
    sovereignVenue,
    errorMsg,
    isLoading: isSovereignVenueLoading,
  } = useSelector(sovereignVenueSelector, isEqual);

  useEffect(() => {
    // NOTE: Force to fetch it only once
    if (!venueId || sovereignVenue || isSovereignVenueLoading || errorMsg)
      return;

    dispatch(setSovereignVenueIsLoading(true));

    tracePromise(
      "useSovereignVenue::fetchSovereignVenue",
      () => fetchSovereignVenue(venueId),
      {
        attributes: {
          venueId,
        },
      }
    )
      .then(({ sovereignVenue }) => {
        dispatch(setSovereignVenue(sovereignVenue));
      })
      .catch((errorMsg) => {
        // @debt Just to stop spamming firebase with requests
        dispatch(setSovereignVenueError(errorMsg));
      })
      .finally(() => {
        dispatch(setSovereignVenueIsLoading(false));
      });
  }, [dispatch, errorMsg, isSovereignVenueLoading, sovereignVenue, venueId]);

  return {
    sovereignVenue,
    sovereignVenueId: sovereignVenue?.id,
    isSovereignVenueLoading,
    errorMsg,
  };
};
