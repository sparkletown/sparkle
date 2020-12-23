export interface LegendProps {
  text: string;
  position?: "left" | "right";
  onClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
}
