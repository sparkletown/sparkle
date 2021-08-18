import { defineNode } from "@ash.ts/ash";

import { BotComponent } from "../components/BotComponent";
import { PositionComponent } from "../components/PositionComponent";

export class BotNode extends defineNode({
  bot: BotComponent,
  position: PositionComponent,
}) {}
