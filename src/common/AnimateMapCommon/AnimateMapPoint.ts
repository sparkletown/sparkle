export type AnimateMapPoint = {
  x: number;
  y: number;
};

export const AnimateMapStartPoint = (): AnimateMapPoint => {
  return { x: 4500, y: 4600 };
};
export const AnimateMapZeroPoint = (): AnimateMapPoint => {
  return { x: 0, y: 0 };
};
