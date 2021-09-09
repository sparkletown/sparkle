import { Easing } from "../../utils/Easing";

export class MotionTeleportComponent {
  public toX?: Easing;
  public toY?: Easing;

  constructor(public x: number, public y: number) {}
}
