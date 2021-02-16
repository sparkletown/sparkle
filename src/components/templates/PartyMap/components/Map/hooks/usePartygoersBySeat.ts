import { useCallback, useMemo } from "react";

import { User } from "types/User";
import { WithId } from "utils/id";
import { ReactHook } from "types/utility";

import { makeMatrixReducer } from "utils/reducers";

interface UsePartygoersbySeatProps {
  venueId: string;
  partygoers: readonly WithId<User>[];
}

interface UsePartygoersbySeatReturn {
  partygoersBySeat: WithId<User>[][];
  isSeatTaken: (row: number, column: number) => boolean;
}

export const usePartygoersbySeat: ReactHook<
  UsePartygoersbySeatProps,
  UsePartygoersbySeatReturn
> = ({ venueId, partygoers }) => {
  const partygoersBySeat = useMemo(() => {
    if (!venueId) return [];

    // TODO: this may be why we don't use row 0...? If so, let's change it to use types better and use undefines
    const selectRow = (partygoer: WithId<User>) =>
      partygoer?.data?.[venueId]?.row ?? 0;

    const selectCol = (partygoer: WithId<User>) =>
      partygoer?.data?.[venueId]?.column ?? 0;

    const partygoersReducer = makeMatrixReducer(selectRow, selectCol);

    return partygoers?.reduce(partygoersReducer, []);
  }, [venueId, partygoers]);

  const isSeatTaken = useCallback(
    (row: number, column: number): boolean =>
      !!partygoersBySeat?.[row]?.[column],
    [partygoersBySeat]
  );

  return { partygoersBySeat, isSeatTaken };
};
