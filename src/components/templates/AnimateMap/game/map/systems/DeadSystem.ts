import { Engine, ListIteratingSystem } from "@ash.ts/ash";

import { DeadNode } from "../nodes/DeadNode";

export class DeadSystem extends ListIteratingSystem<DeadNode> {
  constructor(private engine: Engine) {
    super(DeadNode);
  }
  updateNode(node: DeadNode, delta: number) {
    node.dead.alive -= delta;
    if (node.dead.alive <= 0) {
      this.engine.removeEntity(node.entity);
    }
  }
}
