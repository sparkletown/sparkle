import { defineNode } from "@ash.ts/ash";
import { MovementComponent } from "../components/MovementComponent";
import { PositionComponent } from "../components/PositionComponent";

export class MovementNode extends defineNode({
  position: PositionComponent,
  movement: MovementComponent,
}) {}
