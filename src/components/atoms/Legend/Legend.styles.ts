import styled, { css } from "styled-components";

type LegendProps = {
  position?: "left" | "right";
  hasHoverState?: boolean;
};
const legendLeft = css`
  left: 0;
  border-radius: 0 0 2em 0;
`;
const legendRight = css`
  right: 0;
  border-radius: 0 0 0 2em;
`;
export const Legend = styled.div<LegendProps>`
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
