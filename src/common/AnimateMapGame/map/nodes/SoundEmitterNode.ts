import { defineNode } from "@ash.ts/ash";

import { PositionComponent } from "../components/PositionComponent";
import { SoundEmitterComponent } from "../components/SoundEmitterComponent";

export class SoundEmitterNode extends defineNode({
  position: PositionComponent,
  soundEmitter: SoundEmitterComponent,
}) {}
