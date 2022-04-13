import { defineNode } from "@ash.ts/ash";

import { CollisionComponent } from "../components/CollisionComponent";
import { PositionComponent } from "../components/PositionComponent";
import { VenueComponent } from "../components/VenueComponent";

export class VenueNode extends defineNode({
  venue: VenueComponent,
  position: PositionComponent,
  collision: CollisionComponent,
}) {}
