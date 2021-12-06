import React, { useMemo } from "react";

import { GridPosition } from "types/grid";

import { UserProfilePicture } from "components/molecules/UserProfilePicture";

import { GetUserByPosition } from "../useGetUserByPosition";

export interface UseAuditoriumGridProps {
  isUserAudioOn: boolean;
  rows: number;
  columns: number;
  getUserBySeat: GetUserByPosition;
  checkIfSeat: (gridData: GridPosition) => boolean;
  takeSeat: (gridData: GridPosition) => Promise<void> | undefined;
}

export const useAuditoriumGrid = ({
  isUserAudioOn,
  rows,
  columns,
  checkIfSeat,
  getUserBySeat,
  takeSeat,
}: UseAuditoriumGridProps) =>
  useMemo(
    () =>
      Array.from(Array(rows)).map((_, rowIndex) => (
        <div key={rowIndex} className="Section__seats-row">
          {Array.from(Array(columns)).map((_, columnIndex) => {
            const user = getUserBySeat({
              row: rowIndex,
              column: columnIndex,
            });

            if (user) {
              return (
                <UserProfilePicture
                  key={columnIndex}
                  user={user}
                  containerClassName="Section__user-avatar"
                  isAudioEffectEnabled={isUserAudioOn}
                />
              );
            }

            const isSeat = checkIfSeat({ row: rowIndex, column: columnIndex });

            if (isSeat) {
              return (
                <div
                  key={columnIndex}
                  className="Section__seat"
                  onClick={() =>
                    takeSeat({ row: rowIndex, column: columnIndex })
                  }
                >
                  +
                </div>
              );
            }

            return <div key={columnIndex} className="Section__empty-circle" />;
          })}
        </div>
      )),
    [rows, columns, checkIfSeat, takeSeat, getUserBySeat, isUserAudioOn]
  );
