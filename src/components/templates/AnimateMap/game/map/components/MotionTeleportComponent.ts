import { Easing } from "../../utils/Easing";

export class MotionTeleportComponent {
  public toX: Easing | null = null;
  public toY: Easing | null = null;

  constructor(public x: number, public y: number) {}
}
