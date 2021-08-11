import { defineNode } from "@ash.ts/ash";

import { MotionClickControlComponent } from "../components/MotionClickControlComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";

export class MotionClickControlNode extends defineNode({
  click: MotionClickControlComponent,
  position: PositionComponent,
  movement: MovementComponent,
}) {}
