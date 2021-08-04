import { defineNode } from "@ash.ts/ash";
import { MovementComponent } from "../components/MovementComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";

export class PlayerNode extends defineNode({
  player: PlayerComponent,
  sprite: SpriteComponent,
  movement: MovementComponent,
  position: PositionComponent,
}) {}
