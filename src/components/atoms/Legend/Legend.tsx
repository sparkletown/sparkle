import React from "react";
import styled, { css } from "styled-components";

const legendLeft = css`
  left: 0;
  border-radius: 0 0 2em 0;
`;
const legendRight = css`
  right: 0;
  border-radius: 0 0 0 2em;
`;

const StyledLegend = styled.div<{
  position?: "left" | "right";
  hasHoverState?: boolean;
}>`
  padding: 1.1em;

  position: absolute;
  top: 0;
  ${({ position }) => (position === "left" ? legendLeft : legendRight)};
  // @debt convert this to scss then use our z-index layer helper here
  z-index: 5;

  background: rgba(0, 0, 0, 0.4);

  font-size: 0.9rem;

  cursor: ${({ hasHoverState }) => (hasHoverState ? "pointer" : "default")};
`;

export interface LegendProps {
  text: string;
  position?: "left" | "right";
  onClick?: () => void;
  icon?: Element;
}

// @debt Remove this and all styled-components after v3.
export const Legend: React.FC<LegendProps> = ({
  text,
  position = "left",
  onClick,
  icon,
}) => (
  <StyledLegend position={position} onClick={onClick} hasHoverState={!!onClick}>
    {text}
    {icon}
  </StyledLegend>
);
