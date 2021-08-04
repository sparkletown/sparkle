import { defineNode } from "@ash.ts/ash";
import { SpriteComponent } from "../components/SpriteComponent";
import { ZoomedSpriteComponent } from "../components/ZoomedSpriteComponent";

export class ZoomedSpriteNode extends defineNode({
  sprite: SpriteComponent,
  zoomedSprite: ZoomedSpriteComponent,
}) {}
