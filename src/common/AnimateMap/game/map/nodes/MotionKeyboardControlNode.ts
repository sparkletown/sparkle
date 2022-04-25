import { defineNode } from "@ash.ts/ash";

import { MotionKeyboardControlComponent } from "../components/MotionKeyboardControlComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";

export class MotionKeyboardControlNode extends defineNode({
  keyboard: MotionKeyboardControlComponent,
  position: PositionComponent,
  movement: MovementComponent,
}) {}
