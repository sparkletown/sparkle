import { defineNode } from "@ash.ts/ash";

import { DeadComponent } from "../components/DeadComponent";

export class DeadNode extends defineNode({
  dead: DeadComponent,
}) {}
