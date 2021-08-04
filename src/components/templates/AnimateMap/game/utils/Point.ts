export interface Point {
  x: number;
  y: number;
}

export const StartPoint = (): Point => {
  return { x: 4500, y: 4500 };
};
export const ZeroPoint = (): Point => {
  return { x: 0, y: 0 };
};
