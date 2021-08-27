import { defineNode } from "@ash.ts/ash";

import { PlayerComponent } from "../components/PlayerComponent";
import { PositionComponent } from "../components/PositionComponent";

export class PlayerNode extends defineNode({
  player: PlayerComponent,
  position: PositionComponent,
}) {}
