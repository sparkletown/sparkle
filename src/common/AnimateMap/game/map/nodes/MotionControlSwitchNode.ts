import { defineNode } from "@ash.ts/ash";

import { MotionControlSwitchComponent } from "../components/MotionControlSwitchComponent";

export class MotionControlSwitchNode extends defineNode({
  motionControlSwitch: MotionControlSwitchComponent,
}) {}
