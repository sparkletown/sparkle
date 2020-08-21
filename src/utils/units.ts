export const toPixels = (playaUnits: number, zoom: number, scale: number) => {
  return (playaUnits / scale) * zoom;
};

export const toPlayaUnits = (pixels: number, zoom: number, scale: number) => {
  return (pixels / zoom) * scale;
};
