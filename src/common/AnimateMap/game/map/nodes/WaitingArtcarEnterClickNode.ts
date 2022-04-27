import { defineNode } from "@ash.ts/ash";

import { WaitingArtcarEnterClickComponent } from "../components/WaitingArtcarEnterClickComponent";

export class WaitingArtcarEnterClickNode extends defineNode({
  artcar: WaitingArtcarEnterClickComponent,
}) {}
