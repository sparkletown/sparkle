import { defineNode } from "@ash.ts/ash";
import { SpriteComponent } from "../components/SpriteComponent";
import { ViewportFollowComponent } from "../components/ViewportFollowComponent";
import { PositionComponent } from "../components/PositionComponent";

export class ViewportFollowNode extends defineNode({
  sprite: SpriteComponent,
  follow: ViewportFollowComponent,
  position: PositionComponent,
}) {}
