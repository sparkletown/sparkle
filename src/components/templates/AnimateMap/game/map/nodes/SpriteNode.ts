import { defineNode } from "@ash.ts/ash";
import { SpriteComponent } from "../components/SpriteComponent";
import { PositionComponent } from "../components/PositionComponent";

export class SpriteNode extends defineNode({
  position: PositionComponent,
  sprite: SpriteComponent,
}) {}
