import React, { useMemo } from "react";

import { User } from "types/User";
import { WithId } from "utils/id";
import { ReactHook } from "types/utility";

import { MapRow } from "../../../molecules/MapRow";

interface UseMapGrid {
  showGrid?: boolean;
  userUid?: string;
  columnsArray: JSX.Element[];
  rowsArray: JSX.Element[];
  partygoersBySeat?: WithId<User>[][];
  onSeatClick: (
    row: number,
    column: number,
    seatedPartygoer: WithId<User> | null
  ) => void;
}

export type UseMapGridReturn = false | JSX.Element[] | undefined;

export const useMapGrid: ReactHook<UseMapGrid, UseMapGridReturn> = ({
  showGrid,
  userUid,
  columnsArray,
  rowsArray,
  partygoersBySeat,
  onSeatClick,
}) => {
  return useMemo(
    () =>
      showGrid &&
      columnsArray.map((_, colIndex) => (
        <div className="seat-column" key={`column${colIndex}`}>
          {rowsArray.map((_, rowIndex) => {
            const column = colIndex + 1; // TODO: do these need to be here, can we zero index?
            const row = rowIndex + 1; // TODO: do these need to be here, can we zero index?

            const seatedPartygoer = partygoersBySeat?.[row]?.[column] ?? null;
            const hasSeatedPartygoer = !!seatedPartygoer;

            // TODO: our types imply that this shouldn't be able to be null, but it was..
            const isMe = seatedPartygoer?.id === userUid;

            return (
              <MapRow
                key={`row${rowIndex}`}
                row={row}
                column={column}
                showGrid={showGrid}
                seatedPartygoer={seatedPartygoer}
                hasSeatedPartygoer={hasSeatedPartygoer}
                seatedPartygoerIsMe={isMe}
                onSeatClick={onSeatClick}
              />
            );
          })}
        </div>
      )),
    [columnsArray, onSeatClick, partygoersBySeat, rowsArray, showGrid, userUid]
  );
};
