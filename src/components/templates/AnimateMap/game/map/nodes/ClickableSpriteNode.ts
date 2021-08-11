import { defineNode } from "@ash.ts/ash";

import { ClickableSpriteComponent } from "../components/ClickableSpriteComponent";
import { SpriteComponent } from "../components/SpriteComponent";

export class ClickableSpriteNode extends defineNode({
  click: ClickableSpriteComponent,
  sprite: SpriteComponent,
}) {}
