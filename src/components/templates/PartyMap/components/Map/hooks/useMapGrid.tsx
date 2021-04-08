import React, { useMemo } from "react";

import { User } from "types/User";
import { ReactHook } from "types/utility";

import { WithId } from "utils/id";

import { GetUserByPostion } from "hooks/useGetUserByPosition";

import { MapCell } from "components/molecules/MapCell";

interface UseMapGrid {
  showGrid?: boolean;
  userUid?: string;
  columnsArray: JSX.Element[];
  rowsArray: JSX.Element[];
  getUserBySeat: GetUserByPostion;
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
  getUserBySeat,
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

            const seatedPartygoer = getUserBySeat({ row, column });
            const hasSeatedPartygoer = seatedPartygoer !== undefined;

            // TODO: our types imply that this shouldn't be able to be null, but it was..
            const isMe = seatedPartygoer?.id === userUid;

            return (
              <MapCell
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
    [columnsArray, onSeatClick, getUserBySeat, rowsArray, showGrid, userUid]
  );
};
