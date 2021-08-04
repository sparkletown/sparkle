import { Engine, NodeList } from "@ash.ts/ash";
import { MotionClickControlComponent } from "../components/MotionClickControlComponent";
import EntityFactory from "../entities/EntityFactory";
import { MotionClickControlNode } from "../nodes/MotionClickControlNode";
import { ViewportNode } from "../nodes/ViewportNode";
import { MotionBaseSystem } from "./MotionBaseSystem";

export class MotionClickSystem extends MotionBaseSystem {
  private nodes: NodeList<MotionClickControlNode> | null = null;

  constructor(private entityFactory: EntityFactory) {
    super();
  }

  addToEngine(engine: Engine): void {
    this.nodes = engine.getNodeList(MotionClickControlNode);
    this.viewport = engine.getNodeList(ViewportNode);
  }

  removeFromEngine(engine: Engine): void {
    this.nodes = null;
    this.viewport = null;
  }

  update(time: number): void {
    for (
      let node: MotionClickControlNode | null | undefined = this.nodes?.head;
      node;
      node = node.next
    ) {
      const speed = Math.sqrt(
        node.movement.velocityX * node.movement.velocityX +
          node.movement.velocityY * node.movement.velocityY
      );
      let dx = node.click.x - node.position.x;
      let dy = node.click.y - node.position.y;

      const defaultSpeed = this.getSpeed();

      if (
        Math.abs(dx) - defaultSpeed <= 0 &&
        Math.abs(dy) - defaultSpeed <= 0
      ) {
        node.position.x = node.click.x;
        node.position.y = node.click.y;
        node.movement.velocityX = 0;
        node.movement.velocityY = 0;
        node.entity.remove(MotionClickControlComponent);
        return;
      }

      const length = Math.sqrt(dx * dx + dy * dy);
      dx /= length;
      dy /= length;

      node.movement.velocityX = dx * (speed === 0 ? defaultSpeed : speed);
      node.movement.velocityY = dy * (speed === 0 ? defaultSpeed : speed);
    }
  }
}
