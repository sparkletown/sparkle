import React, { useCallback } from "react";

import { User } from "types/User";
import { WithId } from "utils/id";

interface MapRowProps {
  row: number;
  column: number;
  seatedPartygoer: WithId<User> | null; // @debt changed this to be undefined?

  /** @default false **/
  showGrid?: boolean;

  /** @default false **/
  hasSeatedPartygoer?: boolean;

  /** @default false **/
  seatedPartygoerIsMe?: boolean;

  onSeatClick?: (
    row: number,
    column: number,
    seatedPartygoer: WithId<User> | null
  ) => void;
}

export const MapRow: React.FC<MapRowProps> = ({
  row,
  column,
  seatedPartygoer,

  showGrid = false,
  hasSeatedPartygoer = false,
  seatedPartygoerIsMe = false,
  onSeatClick,
}) => {
  const handleSeatClick = useCallback(
    () => onSeatClick && onSeatClick(row, column, seatedPartygoer),
    [column, onSeatClick, row, seatedPartygoer]
  );

  if (!showGrid) return <div className="seat-row" />;
  return (
    <div className="seat-row">
      <div className="seat-container" onClick={handleSeatClick}>
        <div className={hasSeatedPartygoer ? "seat" : "not-seat"}>
          {hasSeatedPartygoer && (
            <div className={seatedPartygoerIsMe ? "user avatar" : "user"} />
          )}
        </div>
      </div>
    </div>
  );
};
