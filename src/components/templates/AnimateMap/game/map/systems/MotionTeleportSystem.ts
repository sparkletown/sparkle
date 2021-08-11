import { Engine, NodeList } from "@ash.ts/ash";

import { Easing } from "../../utils/Easing";
import EntityFactory from "../entities/EntityFactory";
import { MotionTeleportNode } from "../nodes/MotionTeleportNode";

import { MotionBaseSystem } from "./MotionBaseSystem";

export class MotionTeleportSystem extends MotionBaseSystem {
  private nodes: NodeList<MotionTeleportNode> | null = null;

  constructor(public creator: EntityFactory) {
    super();
  }

  addToEngine(engine: Engine): void {
    this.nodes = engine.getNodeList(MotionTeleportNode);
    this.nodes.nodeAdded.add(this.nodeAdded);
  }

  removeFromEngine(engine: Engine): void {
    if (this.nodes) {
      this.nodes.nodeAdded.remove(this.nodeAdded);
      this.nodes = null;
    }
  }

  update(time: number): void {
    for (
      let node: MotionTeleportNode | null | undefined = this.nodes?.head;
      node;
      node = node.next
    ) {
      if (node.tween.toX) {
        node.tween.toX.update(time);
        node.position.x = node.tween.toX.currentValue;
      }
      if (node.tween.toY) {
        node.tween.toY.update(time);
        node.position.y = node.tween.toY.currentValue;
      }
    }
  }

  private nodeAdded = (node: MotionTeleportNode): void => {
    const duration = 500;
    const toX: Easing = new Easing(node.position.x, node.tween.x, duration);
    const toY: Easing = new Easing(node.position.y, node.tween.y, duration);

    node.tween.toX = toX;
    node.tween.toY = toY;
  };
}
