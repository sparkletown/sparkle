import { defineNode } from "@ash.ts/ash";

import { HoverableSpriteComponent } from "../components/HoverableSpriteComponent";
import { SpriteComponent } from "../components/SpriteComponent";

export class HoverableSpriteNode extends defineNode({
  hover: HoverableSpriteComponent,
  sprite: SpriteComponent,
}) {}
