export const snapToGrid = (x: number, y: number): [number, number] => {
  const snappedX = Math.round(x / 8) * 8;
  const snappedY = Math.round(y / 8) * 8;
  return [snappedX, snappedY];
};
