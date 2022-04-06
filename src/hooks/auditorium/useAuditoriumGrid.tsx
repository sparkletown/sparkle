import React, { useCallback, useMemo } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SECTION_CAPACITY } from "settings";

import { SeatPosition } from "types/grid";

import { UserProfilePicture } from "components/molecules/UserProfilePicture";

import { GetUserByPosition } from "../useGetUserByPosition";

// @debt move the components and its styles in their own directory under ./src/components
import styles from "./seats.module.scss";

interface SeatProps {
  takeSeat: (gridData: SeatPosition) => Promise<void>;
  seatIndex: number;
}

const Seat = ({ takeSeat, seatIndex }: SeatProps) => {
  const takeSpecificSeat = useCallback(() => takeSeat({ seatIndex }), [
    seatIndex,
    takeSeat,
  ]);
  return (
    <div className={styles.seat} onClick={takeSpecificSeat}>
      <FontAwesomeIcon icon={faPlus} />
    </div>
  );
};

export interface UseAuditoriumGridProps {
  isUserAudioMuted: boolean;
  getUserBySeat: GetUserByPosition;
  takeSeat: (gridData: SeatPosition) => Promise<void>;
}

export const useAuditoriumGrid = ({
  isUserAudioMuted,
  getUserBySeat,
  takeSeat,
}: UseAuditoriumGridProps) => {
  return useMemo(() => {
    return Array.from(Array(SECTION_CAPACITY)).map((_, seatIndex) => {
      const user = getUserBySeat({
        seatIndex,
      });

      if (user) {
        return (
          <UserProfilePicture
            key={seatIndex}
            user={user}
            containerClassName={styles.takenSeat}
            isAudioEffectDisabled={isUserAudioMuted}
            size="medium"
          />
        );
      }

      return <Seat key={seatIndex} takeSeat={takeSeat} seatIndex={seatIndex} />;
    });
  }, [takeSeat, getUserBySeat, isUserAudioMuted]);
};
