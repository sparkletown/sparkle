import { defineNode } from "@ash.ts/ash";

import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";

export class SpriteNode extends defineNode({
  position: PositionComponent,
  sprite: SpriteComponent,
}) {}
