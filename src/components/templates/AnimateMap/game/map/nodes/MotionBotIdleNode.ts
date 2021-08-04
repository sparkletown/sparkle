import { defineNode } from "@ash.ts/ash";
import { BotComponent } from "../components/BotComponent";
import { MotionBotIdleComponent } from "../components/MotionBotIdleComponent";

export class MotionBotIdleNode extends defineNode({
  bot: BotComponent,
  idle: MotionBotIdleComponent,
}) {}
