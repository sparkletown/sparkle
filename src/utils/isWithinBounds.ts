import { Bounds, Point } from "types/utility";

/**
 * Check if point exists within the area denoted by bounds.
 *
 * @param point {Point} The Point (x, y) to check
 * @param bounds {Bounds} The Bounds (x, y, width, height) to check within
 */
export const isWithinBounds = (point: Point, bounds: Bounds): boolean => {
  const isWithinX = bounds.x <= point.x && point.x <= bounds.x + bounds.width;
  const isWithinY = bounds.y <= point.y && point.y <= bounds.y + bounds.height;

  return isWithinX && isWithinY;
};
