import { useMemo } from "react";

import { User } from "types/User";
import { WithId } from "utils/id";
import { partygoersSelector } from "utils/selectors";

import { useConnectPartyGoers } from "./useConnectPartyGoers";
import { useSelector } from "./useSelector";
import { useUserLastSeenThreshold } from "./useUserLastSeenThreshold";

/**
 * Hook to retrieve a list of partygoers who were in venueName
 * within lastSeenThreshold.
 *
 * @param venueName venueName to filter partygoers by
 */
export const useCampPartygoers = (venueName: string): WithId<User>[] => {
  useConnectPartyGoers();
  const partygoers = useSelector(partygoersSelector) ?? [];

  const lastSeenThreshold = useUserLastSeenThreshold();

  return useMemo(
    () =>
      partygoers.filter(
        (partygoer) => partygoer?.lastSeenIn?.[venueName] > lastSeenThreshold
      ),
    [partygoers, lastSeenThreshold, venueName]
  );
};
