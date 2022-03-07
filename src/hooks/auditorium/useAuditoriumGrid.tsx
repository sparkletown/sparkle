import React, { useMemo } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GridPosition } from "types/grid";

import { UserProfilePicture } from "components/molecules/UserProfilePicture";

import { GetUserByPosition } from "../useGetUserByPosition";

// @debt move the components and its styles in their own directory under ./src/components
import styles from "./seats.module.scss";

export interface UseAuditoriumGridProps {
  isUserAudioMuted: boolean;
  getUserBySeat: GetUserByPosition;
  takeSeat: (gridData: GridPosition) => Promise<void> | undefined;
}

export const useAuditoriumGrid = ({
  isUserAudioMuted,
  getUserBySeat,
  takeSeat,
}: UseAuditoriumGridProps) => {
  const rows = 9;
  const columns = 24;
  return useMemo(
    () =>
      Array.from(Array(rows)).map((_, rowIndex) => (
        <div key={rowIndex} className={styles.seatsRow}>
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
                  isAudioEffectDisabled={isUserAudioMuted}
                  size="medium"
                />
              );
            }

            return (
              <div
                key={columnIndex}
                className={styles.seat}
                onClick={() => takeSeat({ row: rowIndex, column: columnIndex })}
              >
                <FontAwesomeIcon icon={faPlus} />
              </div>
            );
          })}
        </div>
      )),
    [rows, columns, takeSeat, getUserBySeat, isUserAudioMuted]
  );
};
