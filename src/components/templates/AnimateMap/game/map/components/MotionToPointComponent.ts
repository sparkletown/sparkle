import { Point } from "types/utility";

import { StartPoint } from "../../utils/Point";

export class MotionToPointComponent {
  constructor(
    public speed: number = 100,
    public destination: Point = StartPoint()
  ) {}
}
