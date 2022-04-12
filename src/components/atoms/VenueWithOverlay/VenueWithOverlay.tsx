import React from "react";

import "./VenueWithOverlay.scss";

type VenueWithOverlayProps = {
  style?: React.CSSProperties;
};

export const VenueWithOverlay: React.FC<VenueWithOverlayProps> = ({
  children,
  style,
}) => (
  <div style={style}>
    <div className="VenueWithOverlay" />
    {children}
  </div>
);
