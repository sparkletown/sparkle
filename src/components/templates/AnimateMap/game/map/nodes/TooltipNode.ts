import { defineNode } from "@ash.ts/ash";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { TooltipComponent } from "../components/TooltipComponent";

export class TooltipNode extends defineNode({
  tooltip: TooltipComponent,
  position: PositionComponent,
  sprite: SpriteComponent,
}) {}
