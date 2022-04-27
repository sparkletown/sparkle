import { GamePoint } from "../../common";
import { StartPoint } from "../../utils/Point";

export class MotionToPointComponent {
  constructor(
    public speed: number = 100,
    public destination: GamePoint = StartPoint()
  ) {}
}
