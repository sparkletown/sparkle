import { defineNode } from "@ash.ts/ash";

import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { ViewportFollowComponent } from "../components/ViewportFollowComponent";

export class ViewportFollowNode extends defineNode({
  sprite: SpriteComponent,
  follow: ViewportFollowComponent,
  position: PositionComponent,
}) {}
