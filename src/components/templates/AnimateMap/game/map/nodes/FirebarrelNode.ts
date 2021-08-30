import { defineNode } from "@ash.ts/ash";

import { CollisionComponent } from "../components/CollisionComponent";
import { FirebarrelComponent } from "../components/FirebarrelComponent";
import { PositionComponent } from "../components/PositionComponent";

export class FirebarrelNode extends defineNode({
  firebarrel: FirebarrelComponent,
  position: PositionComponent,
  collision: CollisionComponent,
}) {}
