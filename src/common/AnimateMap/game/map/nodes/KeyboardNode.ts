import { defineNode } from "@ash.ts/ash";

import { KeyboardComponent } from "../components/KeyboardComponent";
import { MotionKeyboardControlComponent } from "../components/MotionKeyboardControlComponent";

export class KeyboardNode extends defineNode({
  keyboard: KeyboardComponent,
  control: MotionKeyboardControlComponent,
}) {}
