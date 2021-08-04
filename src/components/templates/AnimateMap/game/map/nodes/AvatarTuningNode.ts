import { defineNode } from "@ash.ts/ash";
import { AvatarTuningComponent } from "../components/AvatarTuningComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";

export class AvatarTuningNode extends defineNode({
  tuning: AvatarTuningComponent,
  position: PositionComponent,
  sprite: SpriteComponent,
}) {}
