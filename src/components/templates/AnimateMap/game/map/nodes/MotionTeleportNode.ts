import { defineNode } from "@ash.ts/ash";
import { MotionTeleportComponent } from "../components/MotionTeleportComponent";
import { PositionComponent } from "../components/PositionComponent";

export class MotionTeleportNode extends defineNode({
  tween: MotionTeleportComponent,
  position: PositionComponent,
}) {}
