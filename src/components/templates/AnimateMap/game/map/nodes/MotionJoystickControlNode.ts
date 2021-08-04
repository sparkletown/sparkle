import { defineNode } from "@ash.ts/ash";
import { MovementComponent } from "../components/MovementComponent";
import { MotionJoystickControlComponent } from "../components/MotionJoystickControlComponent";

export class MotionJoystickControlNode extends defineNode({
  joystick: MotionJoystickControlComponent,
  movement: MovementComponent,
}) {}
