import { defineNode } from "@ash.ts/ash";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";
import { MotionClickControlComponent } from "../components/MotionClickControlComponent";

export class MotionClickControlNode extends defineNode({
  click: MotionClickControlComponent,
  position: PositionComponent,
  movement: MovementComponent,
}) {}
