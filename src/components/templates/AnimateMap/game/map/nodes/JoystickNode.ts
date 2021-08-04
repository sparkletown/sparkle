import { defineNode } from "@ash.ts/ash";
import { JoystickComponent } from "../components/JoystickComponent";

export class JoystickNode extends defineNode({
  joystick: JoystickComponent,
}) {}
