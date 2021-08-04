import { defineNode } from "@ash.ts/ash";
import { BubbleComponent } from "../components/BubbleComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";

export class BubbleNode extends defineNode({
  bubble: BubbleComponent,
  position: PositionComponent,
  sprite: SpriteComponent,
}) {}
