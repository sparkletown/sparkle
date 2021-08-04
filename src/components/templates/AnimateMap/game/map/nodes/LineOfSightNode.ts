import { defineNode } from "@ash.ts/ash";
import { LineOfSightComponent } from "../components/LineOfSightComponent";

export class LineOfSightNode extends defineNode({
  lineOfSight: LineOfSightComponent,
}) {}
