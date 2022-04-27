import { defineNode } from "@ash.ts/ash";

import { MotionJoystickControlComponent } from "../components/MotionJoystickControlComponent";
import { MovementComponent } from "../components/MovementComponent";

export class MotionJoystickControlNode extends defineNode({
  joystick: MotionJoystickControlComponent,
  movement: MovementComponent,
}) {}
