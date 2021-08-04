import { Point } from "./Point";

export function getNormilzedYFromBezier(
  p0: Point,
  p0hr: Point,
  p1hl: Point,
  p1: Point,
  min: number,
  max: number,
  current: number
) {
  const t = (current - min) / (max - min);
  const calc = (p1: Point, p2: Point) => {
    return {
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t,
    };
  };
  const t1: Point = calc(p0, p0hr);
  const t2: Point = calc(p0hr, p1hl);
  const t3: Point = calc(p1hl, p1);
  const p2hl: Point = calc(t1, t2);
  const p2hr: Point = calc(t2, t3);
  const p2: Point = calc(p2hl, p2hr);

  return p2.y /* (max - min) + min*/;
}
