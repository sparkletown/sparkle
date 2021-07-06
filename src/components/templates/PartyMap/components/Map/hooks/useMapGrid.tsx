import React, { useMemo } from "react";

import { User } from "types/User";
import { ReactHook } from "types/utility";

import { WithId } from "utils/id";

import { MapCell } from "components/molecules/MapCell";

interface UseMapGrid {
  showGrid?: boolean;
  userUid?: string;
  columnsArray: JSX.Element[];
  rowsArray: JSX.Element[];
  partygoersBySeat?: WithId<User>[][];
  onSeatClick: (
    row: number,
    column: number,
    seatedPartygoer?: WithId<User>
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

            const seatedPartygoer = partygoersBySeat?.[row]?.[column];
            const hasSeatedPartygoer = seatedPartygoer !== undefined;

            // TODO: our types imply that this shouldn't be able to be null, but it was..
            const isMe = seatedPartygoer?.id === userUid;

            return (
              <MapCell
                key={`row${rowIndex}`}
                row={row}
                column={column}
                showGrid={showGrid}
                // @debt do we need these *partygoer* props here anymore? See debt notes in MapCell for more details
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
