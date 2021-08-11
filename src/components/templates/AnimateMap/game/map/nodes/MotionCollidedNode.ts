import { defineNode } from "@ash.ts/ash";

import { CollisionComponent } from "../components/CollisionComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";

export class MotionCollidedNode extends defineNode({
  movement: MovementComponent,
  position: PositionComponent,
  collision: CollisionComponent,
}) {}
