import React from "react";

export interface LegendProps {
  text: string;
  position?: "left" | "right";
  onClick?: () => void;
  icon?: Element;
}

export const Legend: React.FC<LegendProps> = ({
  text,
  position = "left",
  onClick,
  icon,
}) => (
  <div onClick={onClick}>
    {text}
    {icon}
  </div>
);
