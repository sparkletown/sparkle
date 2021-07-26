import React from "react";
import { DEFAULT_VENUE_LOGO_PNG } from "settings";

interface LogoProps {
  width?: string;
  height?: string;
}

export const Logo: React.FC<LogoProps> = ({
  width = "100%",
  height = "100%",
}) => {
  return (
    <img
      src={DEFAULT_VENUE_LOGO_PNG}
      width={width}
      height={height}
      alt="Sparkle Logo"
    />
  );
};
