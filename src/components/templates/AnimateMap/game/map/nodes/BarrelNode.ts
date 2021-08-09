import { defineNode } from "@ash.ts/ash";
import { CollisionComponent } from "../components/CollisionComponent";
import { PositionComponent } from "../components/PositionComponent";
import { VenueComponent } from "../components/VenueComponent";
import { BarrelComponent } from "../components/BarrelComponent";

export class BarrelNode extends defineNode({
  barrel: BarrelComponent,
  venue: VenueComponent,
  position: PositionComponent,
  collision: CollisionComponent,
}) {}
