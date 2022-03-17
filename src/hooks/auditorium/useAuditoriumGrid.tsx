import React, { useMemo } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SeatPosition } from "types/grid";

import { UserProfilePicture } from "components/molecules/UserProfilePicture";

import { GetUserByPosition } from "../useGetUserByPosition";

// @debt move the components and its styles in their own directory under ./src/components
import styles from "./seats.module.scss";

export interface UseAuditoriumGridProps {
  isUserAudioMuted: boolean;
  getUserBySeat: GetUserByPosition;
  takeSeat: (gridData: SeatPosition) => Promise<void> | undefined;
}

export const useAuditoriumGrid = ({
  isUserAudioMuted,
  getUserBySeat,
  takeSeat,
}: UseAuditoriumGridProps) => {
  const seatCount = 225;
  return useMemo(() => {
    return Array.from(Array(seatCount)).map((_, seatIndex) => {
      const user = getUserBySeat({
        seatIndex,
      });

      if (user) {
        return (
          <UserProfilePicture
            key={seatIndex}
            user={user}
            containerClassName="Section__user-avatar"
            isAudioEffectDisabled={isUserAudioMuted}
            size="medium"
          />
        );
      }

      return (
        <div
          key={seatIndex}
          className={styles.seat}
          onClick={() => takeSeat({ seatIndex })}
        >
          <FontAwesomeIcon icon={faPlus} />
        </div>
      );
    });
  }, [takeSeat, getUserBySeat, isUserAudioMuted]);
};
