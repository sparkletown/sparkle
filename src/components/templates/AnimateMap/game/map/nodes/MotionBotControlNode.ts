import { defineNode } from "@ash.ts/ash";
import { BotComponent } from "../components/BotComponent";
import { MotionBotClickControlComponent } from "../components/MotionBotClickControlComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";

export class MotionBotControlNode extends defineNode({
  bot: BotComponent,
  click: MotionBotClickControlComponent,
  position: PositionComponent,
  movement: MovementComponent,
}) {}
