import { defineNode } from "@ash.ts/ash";

import { FixScaleByViewportZoomComponent } from "../components/FixScaleByViewportZoomComponent";
import { PositionComponent } from "../components/PositionComponent";

export class FixScaleByViewportZoomNode extends defineNode({
  fixSize: FixScaleByViewportZoomComponent,
  position: PositionComponent,
}) {}
