import { defineNode } from "@ash.ts/ash";

import { CollisionComponent } from "../components/CollisionComponent";
import { FirebarrelComponent } from "../components/FirebarrelComponent";
import { PositionComponent } from "../components/PositionComponent";
import { FirebarrelShouter } from "../graphics/FirebarrelShouter";

export class FirebarrelNode extends defineNode({
  firebarrel: FirebarrelComponent,
  position: PositionComponent,
  collision: CollisionComponent,
  shouter: FirebarrelShouter,
}) {}
