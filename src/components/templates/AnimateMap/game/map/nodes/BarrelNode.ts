import { defineNode } from "@ash.ts/ash";

import { BarrelComponent } from "../components/BarrelComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { PositionComponent } from "../components/PositionComponent";

export class BarrelNode extends defineNode({
  barrel: BarrelComponent,
  position: PositionComponent,
  collision: CollisionComponent,
}) {}
