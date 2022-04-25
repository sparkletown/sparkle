import { defineNode } from "@ash.ts/ash";

import { ArtcarComponent } from "../components/ArtcarComponent";
import { CollisionComponent } from "../components/CollisionComponent";
import { EllipseComponent } from "../components/EllipseComponent";
import { PositionComponent } from "../components/PositionComponent";

export class ArtcarNode extends defineNode({
  artcar: ArtcarComponent,
  position: PositionComponent,
  elipse: EllipseComponent,
  collision: CollisionComponent,
}) {}
