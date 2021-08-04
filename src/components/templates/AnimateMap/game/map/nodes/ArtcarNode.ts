import { defineNode } from "@ash.ts/ash";
import { ArtcarComponent } from "../components/ArtcarComponent";
import { EllipseComponent } from "../components/EllipseComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";

export class ArtcarNode extends defineNode({
  artcar: ArtcarComponent,
  position: PositionComponent,
  movement: MovementComponent,
  elipse: EllipseComponent,
}) {}
