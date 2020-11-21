import React from "react";

interface MapRowProps {
  /** @default false **/
  showGrid?: boolean;

  /** @default false **/
  hasSeatedPartygoer?: boolean;

  /** @default false **/
  seatedPartygoerIsMe?: boolean;

  onSeatClick?: () => void;
}

export const MapRow: React.FC<MapRowProps> = ({
  showGrid = false,
  hasSeatedPartygoer = false,
  seatedPartygoerIsMe = false,
  onSeatClick,
}) => {
  if (!showGrid) return <div className="seat-row" />;
  return (
    <div className="seat-row">
      <div className="seat-container" onClick={onSeatClick}>
        <div className={hasSeatedPartygoer ? "seat" : "not-seat"}>
          {hasSeatedPartygoer && (
            <div className={seatedPartygoerIsMe ? "user avatar" : "user"} />
          )}
        </div>
      </div>
    </div>
  );
};
