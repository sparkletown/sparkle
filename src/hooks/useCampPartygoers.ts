import { useMemo } from "react";

import { User } from "types/User";
import { WithId } from "utils/id";

import { usePartygoers } from "./usePartygoers";
import { useUserLastSeenThreshold } from "./useUserLastSeenThreshold";

/**
 * Hook to retrieve a list of partygoers who were in venueName
 * within lastSeenThreshold.
 *
 * @param venueName venueName to filter partygoers by
 */
export const useCampPartygoers = (venueName: string): WithId<User>[] => {
  const partygoers = usePartygoers();

  const lastSeenThreshold = useUserLastSeenThreshold();

  return useMemo(
    () =>
      partygoers.filter(
        (partygoer) => partygoer?.lastSeenIn?.[venueName] > lastSeenThreshold
      ),
    [partygoers, lastSeenThreshold, venueName]
  );
};
