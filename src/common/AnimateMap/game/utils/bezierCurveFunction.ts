import { GamePoint } from "../common";

//TODO: NaN exception handler must be added
export const getNormilzedYFromBezier = (
  p0: GamePoint,
  p0hr: GamePoint,
  p1hl: GamePoint,
  p1: GamePoint,
  min: number,
  max: number,
  current: number
) => {
  const t = (current - min) / (max - min);
  const calc = (p1: GamePoint, p2: GamePoint) => {
    return {
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t,
    };
  };
  const t1: GamePoint = calc(p0, p0hr);
  const t2: GamePoint = calc(p0hr, p1hl);
  const t3: GamePoint = calc(p1hl, p1);
  const p2hl: GamePoint = calc(t1, t2);
  const p2hr: GamePoint = calc(t2, t3);
  const p2: GamePoint = calc(p2hl, p2hr);

  return p2.y /* (max - min) + min*/;
};
