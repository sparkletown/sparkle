import React, { FC } from "react";

interface ZoomControlsProps {
  disableZoomIn: boolean;
  disableZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export const ZoomControls: FC<ZoomControlsProps> = ({
  disableZoomIn,
  disableZoomOut,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <div className="party-map-zoom-container">
      <div
        className={`party-map-zoom-in ${disableZoomIn ? "disabled" : ""}`}
        onClick={onZoomIn}
      />
      <div
        className={`party-map-zoom-out ${disableZoomOut ? "disabled" : ""}`}
        onClick={onZoomOut}
      />
    </div>
  );
};
