import { useEffect } from "react";
import { isEqual } from "lodash";

import { fetchSovereignVenue } from "api/venue";

import {
  setSovereignVenue,
  setSovereignVenueError,
  setSovereignVenueIsLoading,
} from "store/actions/SovereignVenue";

import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { tracePromise } from "utils/performance";
import { sovereignVenueSelector } from "utils/selectors";

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
