import { defineNode } from "@ash.ts/ash";

import { CollisionComponent } from "../components/CollisionComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { VenueComponent } from "../components/VenueComponent";

export class VenueNode extends defineNode({
  venue: VenueComponent,
  sprite: SpriteComponent,
  position: PositionComponent,
  collision: CollisionComponent,
}) {}
