import { useMemo } from "react";

import { User } from "types/User";
import { WithId } from "utils/id";
import { partygoersSelector } from "utils/selectors";

import { useConnectPartyGoers } from "./useConnectPartyGoers";
import { useSelector } from "./useSelector";
import { useUserLastSeenLimit } from "./useUserLastSeenLimit";

/**
 * Hook to retrieve a list of partygoers who were in venueName
 * within lastSeenThreshold.
 *
 * @param venueName venueName to filter partygoers by
 */
export const useCampPartygoers = (venueName: string): WithId<User>[] => {
  useConnectPartyGoers();
  const partygoers = useSelector(partygoersSelector) ?? [];

  const userLastSeenLimit = useUserLastSeenLimit();

  return useMemo(
    () =>
      partygoers.filter(
        (partygoer) => partygoer?.lastSeenIn?.[venueName] > userLastSeenLimit
      ),
    [partygoers, userLastSeenLimit, venueName]
  );
};
